import { useState, useCallback } from 'react'

/**
 * Shared drag-reschedule state + handlers used by Month/Week views and TBC panel.
 *
 * Usage:
 *   const drag = useDragReschedule(onItemReschedule)
 *
 *   <Chip
 *     onDragStart={drag.onDragStart}
 *     onDragEnd={drag.onDragEnd}
 *     dragging={drag.isDragging(item.id)}
 *   />
 *
 *   <DropZone
 *     onDragOver={drag.onDragOverTarget(newDate)}
 *     onDragLeave={drag.onDragLeave(newDate)}
 *     onDrop={drag.onDrop(newDate)}
 *     isActiveTarget={drag.isTarget(newDate)}
 *   />
 */
export function useDragReschedule(onReschedule) {
  const [draggingId, setDraggingId] = useState(null)
  const [draggingItem, setDraggingItem] = useState(null)
  const [activeTarget, setActiveTarget] = useState(null) // e.g. "2026-05-14" or "__TBC__"

  const onDragStart = useCallback((item) => {
    setDraggingId(item.id)
    setDraggingItem(item)
  }, [])

  const onDragEnd = useCallback(() => {
    setDraggingId(null)
    setDraggingItem(null)
    setActiveTarget(null)
  }, [])

  const isDragging = useCallback((id) => id === draggingId, [draggingId])
  const isTarget = useCallback((key) => key === activeTarget, [activeTarget])

  const makeTargetHandlers = useCallback(
    (targetKey, newDateOrNull) => ({
      onDragOver: (e) => {
        if (!draggingId) return
        // Don't show a drop hint if dropping on the source date
        if (draggingItem && (draggingItem.date || '__TBC__') === targetKey) {
          e.dataTransfer.dropEffect = 'none'
          return
        }
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        if (activeTarget !== targetKey) setActiveTarget(targetKey)
      },
      onDragLeave: (e) => {
        // Only clear if we're actually leaving the target (not a child)
        if (e.currentTarget.contains(e.relatedTarget)) return
        if (activeTarget === targetKey) setActiveTarget(null)
      },
      onDrop: (e) => {
        e.preventDefault()
        if (!draggingId || !draggingItem) return
        const sourceDate = draggingItem.date || null
        // No-op if dropped on the same date
        if ((sourceDate || '__TBC__') !== targetKey) {
          onReschedule?.(draggingItem, newDateOrNull)
        }
        setDraggingId(null)
        setDraggingItem(null)
        setActiveTarget(null)
      },
    }),
    [draggingId, draggingItem, activeTarget, onReschedule],
  )

  return {
    draggingItem,
    isDragging,
    isTarget,
    onDragStart,
    onDragEnd,
    targetHandlers: makeTargetHandlers,
  }
}
