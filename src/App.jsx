import { useEffect, useMemo, useState } from 'react'
import { addDays, addMonths, addWeeks, subDays, subMonths, subWeeks, startOfWeek } from 'date-fns'

import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './components/Dashboard.jsx'
import SearchBar from './components/SearchBar.jsx'
import PresetChips from './components/PresetChips.jsx'
import Stats from './components/Stats.jsx'
import CalendarView from './components/CalendarView.jsx'
import WeekView from './components/WeekView.jsx'
import DayView from './components/DayView.jsx'
import ListView from './components/ListView.jsx'
import TbcPanel from './components/TbcPanel.jsx'
import ItemModal from './components/ItemModal.jsx'
import CampaignDrawer from './components/CampaignDrawer.jsx'
import RequestModal from './components/RequestModal.jsx'
import RequestsPanel from './components/RequestsPanel.jsx'
import DateModal from './components/DateModal.jsx'
import DatesView from './components/DatesView.jsx'
import Toast from './components/Toast.jsx'

import { useContentItems } from './hooks/useContentItems.js'
import { useRequests } from './hooks/useRequests.js'
import { useImportantDates } from './hooks/useImportantDates.js'
import { useDragReschedule } from './hooks/useDragReschedule.js'
import { downloadCsv } from './utils/csv.js'
import { hasSupabase } from './supabase.js'
import { emptyFilters, applyFilters, activeFilterCount } from './utils/filters.js'
import { PRESETS, detectActivePreset } from './utils/presets.js'

const VIEW_PERSIST_KEY = 'wingate_view'
const DASH_PERSIST_KEY = 'wingate_dashboard'

function defaultAnchor() {
  const today = new Date()
  const kickoff = new Date(2026, 3, 1)
  return today > kickoff ? today : kickoff
}

function loadStoredView() {
  if (typeof window === 'undefined') return 'month'
  const v = window.localStorage.getItem(VIEW_PERSIST_KEY)
  return ['month', 'week', 'day', 'list', 'dates'].includes(v) ? v : 'month'
}

function loadDashCollapsed() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(DASH_PERSIST_KEY) === '1'
}

export default function App() {
  const { items, loading, error, addItem, updateItem, deleteItem } = useContentItems()
  const {
    requests,
    tableMissing: requestsTableMissing,
    submitRequest,
    approveRequest,
    ignoreRequest,
    reopenRequest,
    deleteRequest,
  } = useRequests()
  const {
    dates: importantDates,
    tableMissing: datesTableMissing,
    addDate,
    updateDate,
    deleteDate,
  } = useImportantDates()

  const [view, setViewState] = useState(loadStoredView)
  const [anchorDate, setAnchorDate] = useState(defaultAnchor)
  const [filters, setFilters] = useState(emptyFilters)
  const [modal, setModal] = useState(null)
  const [campaignOpen, setCampaignOpen] = useState(null)
  const [toast, setToast] = useState(null)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dashboardCollapsed, setDashCollapsed] = useState(loadDashCollapsed)
  const [requestModalOpen, setRequestModalOpen] = useState(false)
  const [requestsPanelOpen, setRequestsPanelOpen] = useState(false)
  const [pendingApprovalRequestId, setPendingApprovalRequestId] = useState(null)
  const [dateModal, setDateModal] = useState(null) // { mode: 'create'|'edit', initial }

  const pendingRequestCount = useMemo(
    () => requests.filter((r) => r.status === 'pending').length,
    [requests],
  )

  const setView = (v) => {
    setViewState(v)
    try { window.localStorage.setItem(VIEW_PERSIST_KEY, v) } catch {}
  }

  const toggleDash = () => {
    setDashCollapsed((c) => {
      const next = !c
      try { window.localStorage.setItem(DASH_PERSIST_KEY, next ? '1' : '0') } catch {}
      return next
    })
  }

  const allCampaigns = useMemo(() => {
    const set = new Set()
    for (const it of items) if (it.campaign) set.add(it.campaign)
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [items])

  const allOwners = useMemo(() => {
    const set = new Set()
    for (const it of items) if (it.owner) set.add(it.owner)
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [items])

  const filtered = useMemo(() => applyFilters(items, filters), [items, filters])
  const activePreset = useMemo(() => detectActivePreset(filters), [filters])

  const dated = filtered.filter((i) => i.date)
  const tbc = filtered.filter((i) => !i.date)

  const openCreate = (dateStr) => setModal({ mode: 'create', initial: { date: dateStr || '' } })
  const openEdit = (item) => setModal({ mode: 'edit', initial: item })

  const handleSave = async (payload) => {
    if (modal?.mode === 'edit' && modal.initial?.id) {
      await updateItem(modal.initial.id, payload)
      setToast({ type: 'success', message: 'Item updated' })
    } else {
      const created = await addItem(payload)
      // If this save was triggered by approving a request, mark the request approved
      if (pendingApprovalRequestId && created?.id) {
        try {
          await approveRequest(pendingApprovalRequestId, {
            reviewedBy: getReviewerName(),
            linkedItemId: created.id,
          })
          setToast({ type: 'success', message: 'Request approved and added to calendar' })
        } catch (e) {
          console.error('Approve request update failed', e)
          setToast({ type: 'success', message: 'Item added (request status not updated)' })
        }
        setPendingApprovalRequestId(null)
      } else {
        setToast({ type: 'success', message: 'Item added' })
      }
    }
  }

  const handleDelete = async () => {
    if (!modal?.initial?.id) return
    await deleteItem(modal.initial.id)
    setToast({ type: 'success', message: 'Item deleted' })
  }

  const handleDuplicate = (form) => {
    const { id, created_at, updated_at, ...rest } = form
    setModal({
      mode: 'create',
      initial: { ...rest, date: '', topic: `${rest.topic} (copy)` },
    })
    setToast({ type: 'info', message: 'Duplicating — set a new date and Save' })
  }

  const handleExport = () => {
    if (filtered.length === 0) {
      setToast({ type: 'error', message: 'Nothing to export with current filters' })
      return
    }
    const stamp = new Date().toISOString().slice(0, 10)
    downloadCsv(filtered, `wingate-content-plan-${stamp}.csv`)
    setToast({ type: 'success', message: `Exported ${filtered.length} items` })
  }

  const handleReschedule = async (item, newDateIsoOrNull) => {
    if (!item?.id) return
    const prev = item.date || 'TBC'
    const next = newDateIsoOrNull || null
    try {
      await updateItem(item.id, { date: next })
      const label = next
        ? new Date(next + 'T00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
        : 'TBC'
      setToast({ type: 'success', message: `Moved to ${label}` })
    } catch (e) {
      console.error('Reschedule failed', e)
      setToast({ type: 'error', message: `Could not move (was ${prev})` })
    }
  }

  // One shared drag instance so dragging from TBC into the calendar (and back) works
  const drag = useDragReschedule(handleReschedule)

  // ----- Request flows -----

  const getReviewerName = () => {
    try { return window.localStorage.getItem('wingate_content_author') || 'Matt' } catch { return 'Matt' }
  }

  const handleSubmitRequest = async (payload) => {
    try {
      await submitRequest(payload)
    } catch (e) {
      console.error('Submit request failed', e)
      throw e
    }
  }

  const handleApproveRequest = (request) => {
    // Pre-fill the ItemModal from the request. On save, we'll mark the
    // request approved and link the new item via pendingApprovalRequestId.
    setPendingApprovalRequestId(request.id)
    setRequestsPanelOpen(false)
    setModal({
      mode: 'create',
      initial: {
        date: request.requested_date || '',
        channel: request.channel_preferences?.[0] || 'Facebook',
        content_type: 'Post',
        topic: request.description,
        campaign: '',
        owner: getReviewerName(),
        status: 'Planned',
        notes: [
          request.notes?.trim(),
          `Requested by ${request.requester_name} (${request.requester_department})`,
        ].filter(Boolean).join('\n'),
      },
    })
  }

  const handleIgnoreRequest = async (request, reason) => {
    try {
      await ignoreRequest(request.id, { reviewedBy: getReviewerName(), reason })
      setToast({ type: 'info', message: 'Request moved to archive' })
    } catch (e) {
      console.error('Ignore failed', e)
      setToast({ type: 'error', message: 'Could not ignore request' })
    }
  }

  const handleReopenRequest = async (request) => {
    try {
      await reopenRequest(request.id)
      setToast({ type: 'info', message: 'Request reopened' })
    } catch (e) {
      console.error('Reopen failed', e)
      setToast({ type: 'error', message: 'Could not reopen request' })
    }
  }

  const handleDeleteRequest = async (id) => {
    try {
      await deleteRequest(id)
      setToast({ type: 'success', message: 'Request deleted' })
    } catch (e) {
      console.error('Delete request failed', e)
      setToast({ type: 'error', message: 'Could not delete request' })
    }
  }

  // ----- Important date flows -----

  const openDateCreate = () => setDateModal({ mode: 'create', initial: {} })
  const openDateEdit = (d) => setDateModal({ mode: 'edit', initial: d })

  const handleSaveDate = async (payload) => {
    if (dateModal?.mode === 'edit' && dateModal.initial?.id) {
      await updateDate(dateModal.initial.id, payload)
      setToast({ type: 'success', message: 'Date updated' })
    } else {
      await addDate(payload)
      setToast({ type: 'success', message: 'Date added' })
    }
  }

  const handleDeleteDate = async () => {
    if (!dateModal?.initial?.id) return
    await deleteDate(dateModal.initial.id)
    setToast({ type: 'success', message: 'Date deleted' })
  }

  const handlePreset = (presetId) => {
    const p = PRESETS.find((x) => x.id === presetId)
    if (!p) return
    // Toggle back to "all" when clicking an already-active preset
    if (activePreset === presetId && presetId !== 'all') {
      setFilters(emptyFilters())
    } else {
      setFilters(p.build({ currentOwner: 'Matt' }))
    }
  }

  const handleHeatmapCell = ({ channel, date }) => {
    // Filter to just this channel
    setFilters({ ...emptyFilters(), channels: new Set([channel]) })
    // If a specific date was clicked, jump to it in whichever calendar view is active
    if (date) {
      try {
        const d = new Date(date + 'T00:00')
        setAnchorDate(d)
        if (view === 'month' || view === 'list') setView('day')
      } catch {}
    }
  }

  const clearAll = () => setFilters(emptyFilters())

  // ----- Global keyboard shortcuts -----
  useEffect(() => {
    const onKey = (e) => {
      if (modal || campaignOpen) return
      const inInput =
        e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)
      if (inInput) return

      if (e.key === 'm') { setView('month'); return }
      if (e.key === 'w') { setView('week');  return }
      if (e.key === 'd') { setView('day');   return }
      if (e.key === 'l') { setView('list');  return }
      if (e.key === 'n') { openCreate(null); return }
      if (e.key === 't') { setAnchorDate(new Date()); return }

      if (view === 'list' || view === 'dates') return
      if (e.key === 'ArrowLeft') {
        setAnchorDate((d) => view === 'month' ? subMonths(d, 1) : view === 'week' ? subWeeks(d, 1) : subDays(d, 1))
      }
      if (e.key === 'ArrowRight') {
        setAnchorDate((d) => view === 'month' ? addMonths(d, 1) : view === 'week' ? addWeeks(d, 1) : addDays(d, 1))
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [view, modal, campaignOpen])

  if (!hasSupabase) return <MissingEnv />

  return (
    <div className="min-h-full">
      <Header
        totalCount={items.length}
        visibleCount={filtered.length}
        view={view}
        onViewChange={setView}
        onAdd={() => openCreate(null)}
        onExport={handleExport}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex">
        <Sidebar
          mobileOpen={sidebarOpen}
          onMobileClose={() => setSidebarOpen(false)}
          view={view}
          onViewChange={setView}
          onAnchorChange={setAnchorDate}
          allItems={items}
          filters={filters}
          onFiltersChange={setFilters}
          onOpenCampaign={(c) => setCampaignOpen(c)}
          onItemClick={openEdit}
          pendingRequestCount={pendingRequestCount}
          onReviewRequests={() => setRequestsPanelOpen(true)}
          onSubmitRequest={() => setRequestModalOpen(true)}
          importantDates={importantDates}
          onDateItemClick={openDateEdit}
          onAddDate={openDateCreate}
          onOpenAllDates={() => setView('dates')}
        />

        <main className="flex-1 min-w-0 max-w-full">
          <div className="max-w-[1200px] mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4">
            {loading && <LoadingState />}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-sm">
                <strong className="font-semibold">Error:</strong> {error.message}
              </div>
            )}

            {!loading && !error && (
              <>
                {view !== 'dates' && (
                  <SearchBar filters={filters} onChange={setFilters} onClear={clearAll} />
                )}

                <Dashboard
                  collapsed={dashboardCollapsed}
                  onToggleCollapsed={toggleDash}
                  allItems={items}
                  filters={filters}
                  onFiltersChange={setFilters}
                  onItemClick={openEdit}
                  onQuickFilter={handlePreset}
                  onHeatmapCellClick={handleHeatmapCell}
                  pendingRequestCount={pendingRequestCount}
                  onReviewRequests={() => setRequestsPanelOpen(true)}
                  onSubmitRequest={() => setRequestModalOpen(true)}
                  importantDates={importantDates}
                  importantDatesTableMissing={datesTableMissing}
                  onDateItemClick={openDateEdit}
                  onAddDate={openDateCreate}
                  onOpenAllDates={() => setView('dates')}
                />

                {view !== 'dates' && (
                  <>
                    <PresetChips activePreset={activePreset} onApply={handlePreset} />
                    <Stats items={filtered} totalCount={items.length} filters={filters} />
                  </>
                )}

                {view !== 'list' && view !== 'dates' && (
                  <TbcPanel
                    items={tbc}
                    onItemClick={openEdit}
                    onAdd={openCreate}
                    drag={drag}
                  />
                )}

                {view === 'month' && (
                  <CalendarView
                    monthDate={anchorDate}
                    onMonthChange={setAnchorDate}
                    items={dated}
                    onItemClick={openEdit}
                    onAddItem={openCreate}
                    drag={drag}
                    importantDates={importantDates}
                    onDateClick={openDateEdit}
                  />
                )}
                {view === 'week' && (
                  <WeekView
                    anchorDate={anchorDate}
                    onAnchorChange={setAnchorDate}
                    items={dated}
                    onItemClick={openEdit}
                    onAddItem={openCreate}
                    drag={drag}
                    importantDates={importantDates}
                    onDateClick={openDateEdit}
                  />
                )}
                {view === 'day' && (
                  <DayView
                    anchorDate={anchorDate}
                    onAnchorChange={setAnchorDate}
                    items={dated}
                    onItemClick={openEdit}
                    onAddItem={openCreate}
                    importantDates={importantDates}
                    onDateClick={openDateEdit}
                  />
                )}
                {view === 'list' && (
                  <ListView items={filtered} onItemClick={openEdit} />
                )}
                {view === 'dates' && (
                  <DatesView
                    dates={importantDates}
                    tableMissing={datesTableMissing}
                    onItemClick={openDateEdit}
                    onAdd={openDateCreate}
                  />
                )}

                <KeyboardHint />
              </>
            )}
          </div>
        </main>
      </div>

      {modal && (
        <ItemModal
          mode={modal.mode}
          initial={modal.initial}
          knownCampaigns={allCampaigns}
          knownOwners={allOwners}
          onSave={handleSave}
          onDelete={modal.mode === 'edit' ? handleDelete : undefined}
          onDuplicate={modal.mode === 'edit' ? handleDuplicate : undefined}
          onClose={() => {
            setModal(null)
            // If the user cancels an approval, don't leave it "pending approval"
            setPendingApprovalRequestId(null)
          }}
        />
      )}

      {requestModalOpen && (
        <RequestModal
          onSubmit={handleSubmitRequest}
          onClose={() => setRequestModalOpen(false)}
        />
      )}

      {requestsPanelOpen && (
        <RequestsPanel
          requests={requests}
          tableMissing={requestsTableMissing}
          onClose={() => setRequestsPanelOpen(false)}
          onApprove={handleApproveRequest}
          onIgnore={handleIgnoreRequest}
          onReopen={handleReopenRequest}
          onDelete={handleDeleteRequest}
          onSubmitNew={() => {
            setRequestsPanelOpen(false)
            setRequestModalOpen(true)
          }}
        />
      )}

      {campaignOpen && (
        <CampaignDrawer
          campaign={campaignOpen}
          items={items}
          onItemClick={(it) => {
            setCampaignOpen(null)
            openEdit(it)
          }}
          onClose={() => setCampaignOpen(null)}
        />
      )}

      {dateModal && (
        <DateModal
          mode={dateModal.mode}
          initial={dateModal.initial}
          onSave={handleSaveDate}
          onDelete={dateModal.mode === 'edit' ? handleDeleteDate : undefined}
          onClose={() => setDateModal(null)}
        />
      )}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}

function KeyboardHint() {
  return (
    <div className="hidden md:flex items-center justify-center gap-x-5 gap-y-1 flex-wrap pt-2 pb-1 text-[11px] text-[var(--text-3)]">
      <Kbd k="/" label="Search" />
      <Kbd k="N" label="New item" />
      <Kbd k="M · W · D · L" label="Switch view" />
      <Kbd k="T" label="Today" />
      <Kbd k="← →" label="Prev / next" />
    </div>
  )
}

function Kbd({ k, label }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <kbd className="px-1.5 py-0.5 rounded bg-white border border-[var(--border)] text-[10px] font-semibold text-[var(--text-2)]">
        {k}
      </kbd>
      <span>{label}</span>
    </span>
  )
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-card h-14 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl shadow-card h-32 animate-pulse" />
        <div className="bg-white rounded-xl shadow-card h-32 animate-pulse" />
        <div className="bg-white rounded-xl shadow-card h-32 animate-pulse" />
      </div>
      <div className="bg-white rounded-xl shadow-card h-96 animate-pulse" />
    </div>
  )
}

function MissingEnv() {
  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="max-w-lg bg-white rounded-2xl shadow-card border border-[var(--border)] p-6">
        <h1 className="text-xl font-semibold text-[var(--text)] mb-2">Supabase not configured</h1>
        <p className="text-[13px] text-[var(--text-2)] mb-3">
          This app needs two environment variables to connect to your Supabase project:
        </p>
        <pre className="bg-[var(--bg)] text-[var(--text)] text-xs p-3 rounded-lg mb-3 overflow-x-auto border border-[var(--border-2)]">
{`VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>`}
        </pre>
        <p className="text-[13px] text-[var(--text-2)]">
          Copy <code className="text-[var(--accent)]">.env.example</code> to{' '}
          <code className="text-[var(--accent)]">.env</code>, fill in the values, and restart the dev server.
        </p>
      </div>
    </div>
  )
}
