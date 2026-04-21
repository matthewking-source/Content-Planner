import { useEffect } from 'react'
import ViewNav from './sidebar/ViewNav.jsx'
import StatusNav from './sidebar/StatusNav.jsx'
import CampaignNav from './sidebar/CampaignNav.jsx'
import ActivityFeed from './sidebar/ActivityFeed.jsx'
import RequestsNav from './sidebar/RequestsNav.jsx'
import DatesNav from './sidebar/DatesNav.jsx'
import { IconClose } from './Icons.jsx'

export default function Sidebar({
  // Layout
  mobileOpen,
  onMobileClose,
  // View state
  view,
  onViewChange,
  onAnchorChange,
  // Filter state
  allItems,
  filters,
  onFiltersChange,
  onOpenCampaign,
  // Activity
  onItemClick,
  // Requests
  pendingRequestCount,
  onReviewRequests,
  onSubmitRequest,
  // Important dates
  importantDates,
  onDateItemClick,
  onAddDate,
  onOpenAllDates,
}) {
  // Escape closes the mobile drawer
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onMobileClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen, onMobileClose])

  const content = (
    <nav className="h-full flex flex-col overflow-y-auto">
      <div className="flex-1 p-3 space-y-5">
        <RequestsNav
          pendingCount={pendingRequestCount}
          onReview={onReviewRequests}
          onSubmit={onSubmitRequest}
          onClose={onMobileClose}
        />
        <ViewNav
          view={view}
          onViewChange={onViewChange}
          onAnchorChange={onAnchorChange}
          onClose={onMobileClose}
        />
        <StatusNav
          allItems={allItems}
          filters={filters}
          onChange={onFiltersChange}
        />
        <CampaignNav
          allItems={allItems}
          filters={filters}
          onChange={onFiltersChange}
          onOpenCampaign={onOpenCampaign}
        />
        <DatesNav
          dates={importantDates || []}
          onItemClick={onDateItemClick}
          onAdd={onAddDate}
          onOpenAll={onOpenAllDates}
          onClose={onMobileClose}
        />
      </div>
      <div className="border-t border-[var(--border-2)] p-3">
        <ActivityFeed items={allItems} onItemClick={onItemClick} />
      </div>
    </nav>
  )

  return (
    <>
      {/* Desktop: fixed column */}
      <aside className="hidden lg:block w-[260px] shrink-0 border-r border-[var(--border)] bg-white">
        <div className="sticky top-14 h-[calc(100vh-3.5rem)]">
          {content}
        </div>
      </aside>

      {/* Mobile: slide-out drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onMobileClose}
      >
        <div className="absolute inset-0 bg-[rgba(14,18,48,0.45)] backdrop-blur-sm" />
        <div
          className={`absolute inset-y-0 left-0 w-[280px] max-w-[85vw] bg-white shadow-modal transition-transform ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-14 flex items-center justify-between px-3 border-b border-[var(--border-2)]">
            <div className="text-[13px] font-semibold text-[var(--text)]">Menu</div>
            <button
              onClick={onMobileClose}
              className="w-8 h-8 rounded-lg text-[var(--text-3)] hover:bg-[var(--bg)] hover:text-[var(--text)] inline-flex items-center justify-center"
              aria-label="Close menu"
            >
              <IconClose />
            </button>
          </div>
          <div className="h-[calc(100%-3.5rem)] overflow-hidden">
            {content}
          </div>
        </div>
      </div>
    </>
  )
}
