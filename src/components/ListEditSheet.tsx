import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import closeIcon from '../assets/icons/ico-close-xs.svg'
import checkDefaultIcon from '../assets/icons/ico-check-xs-default.svg'
import checkActiveIcon from '../assets/icons/ico-check-xs-active.svg'
import topCheckIcon from '../assets/icons/ico-top-check.svg'
import alignIcon from '../assets/icons/ico-align.svg'
import deleteIcon from '../assets/icons/ico-context-delete.svg'
import coverImage from '../assets/images/album-cover-like.png'
import { type LovedListItem } from './LovedListDetailPage'
import { useTranslation } from 'react-i18next'
import './ExplorePage.css'
import './MyPage.css'
import './ListEditSheet.css'

type ListEditRestaurantCategory = 'Cafe' | 'Restaurant'

export type ListEditRestaurant = {
  id: string
  name: string
  category: ListEditRestaurantCategory
  address: string
  icon: string
}

type ListEditSheetProps = {
  open: boolean
  listItem: LovedListItem
  restaurants: ListEditRestaurant[]
  onClose: () => void
  onSave: (payload: { listItem: LovedListItem; restaurants: ListEditRestaurant[]; isPublished: boolean }) => void
}

const isSameOrder = (left: ListEditRestaurant[], right: ListEditRestaurant[]) =>
  left.length === right.length && left.every((item, index) => item.id === right[index]?.id)

const moveItem = (items: ListEditRestaurant[], draggedId: string, targetId: string, insertAfter: boolean) => {
  const next = [...items]
  const fromIndex = next.findIndex((item) => item.id === draggedId)
  const targetIndex = next.findIndex((item) => item.id === targetId)

  if (fromIndex < 0 || targetIndex < 0 || fromIndex === targetIndex) {
    return items
  }

  const [movedItem] = next.splice(fromIndex, 1)
  let insertIndex = insertAfter ? targetIndex + 1 : targetIndex

  if (fromIndex < targetIndex) {
    insertIndex -= 1
  }

  next.splice(insertIndex, 0, movedItem)
  return next
}

export function ListEditSheet({ open, listItem, restaurants, onClose, onSave }: ListEditSheetProps) {
  const { t } = useTranslation()
  const [draftTitle, setDraftTitle] = useState(listItem.title)
  const [isTitleEditing, setIsTitleEditing] = useState(false)
  const [isPublished, setIsPublished] = useState(true)
  const [draftRestaurants, setDraftRestaurants] = useState<ListEditRestaurant[]>(restaurants)
  const [selectedRestaurantIds, setSelectedRestaurantIds] = useState<string[]>([])
  const [draggingRestaurantId, setDraggingRestaurantId] = useState<string | null>(null)
  const dragStateRef = useRef<{
    itemId: string | null
    pointerId: number | null
    startX: number
    startY: number
    currentX: number
    currentY: number
    didMove: boolean
  }>({
    itemId: null,
    pointerId: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    didMove: false,
  })

  useEffect(() => {
    if (!open) {
      return
    }

    setDraftTitle(listItem.title)
    setIsTitleEditing(false)
    setIsPublished(true)
    setDraftRestaurants(restaurants)
    setSelectedRestaurantIds([])
    setDraggingRestaurantId(null)
    dragStateRef.current = {
      itemId: null,
      pointerId: null,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      didMove: false,
    }
  }, [listItem.title, open, restaurants])

  const selectedCount = selectedRestaurantIds.length
  const allSelected = draftRestaurants.length > 0 && selectedCount === draftRestaurants.length
  const hasChanges =
    draftTitle.trim().length > 0 &&
    (draftTitle.trim() !== listItem.title || !isPublished || !isSameOrder(draftRestaurants, restaurants))

  const toggleRestaurantSelection = (itemId: string) => {
    setSelectedRestaurantIds((current) => (current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId]))
  }

  const toggleSelectAll = () => {
    setSelectedRestaurantIds((current) => (current.length === draftRestaurants.length ? [] : draftRestaurants.map((item) => item.id)))
  }

  const deleteSelectedRestaurants = () => {
    if (selectedRestaurantIds.length === 0) {
      return
    }

    setDraftRestaurants((current) => current.filter((item) => !selectedRestaurantIds.includes(item.id)))
    setSelectedRestaurantIds([])
  }

  const commitSave = () => {
    if (!hasChanges) {
      return
    }

    onSave({
      listItem: {
        ...listItem,
        title: draftTitle.trim(),
      },
      restaurants: draftRestaurants,
      isPublished,
    })
    onClose()
  }

  const reorderByPointer = (pointerY: number) => {
    const hoveredElement = document
      .elementFromPoint(dragStateRef.current.currentX, pointerY)
      ?.closest<HTMLElement>('[data-list-edit-item-id]')

    const draggedId = dragStateRef.current.itemId
    const targetId = hoveredElement?.dataset.listEditItemId ?? null

    if (!draggedId || !targetId || draggedId === targetId) {
      return
    }

    if (!hoveredElement) {
      return
    }

    const targetRect = hoveredElement.getBoundingClientRect()
    const insertAfter = pointerY > targetRect.top + targetRect.height / 2
    setDraftRestaurants((current) => moveItem(current, draggedId, targetId, insertAfter))
  }

  const startPointerDrag = (event: PointerEvent<HTMLButtonElement>, itemId: string) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    dragStateRef.current = {
      itemId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY,
      didMove: false,
    }
    setDraggingRestaurantId(itemId)

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const updatePointerDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current
    if (dragState.itemId !== event.currentTarget.dataset.dragHandleFor || dragState.pointerId !== event.pointerId) {
      return
    }

    const movementX = Math.abs(event.clientX - dragState.startX)
    const movementY = Math.abs(event.clientY - dragState.startY)
    if (!dragState.didMove && movementX < 6 && movementY < 6) {
      return
    }

    dragState.currentX = event.clientX
    dragState.currentY = event.clientY
    dragState.didMove = true
    reorderByPointer(event.clientY)
  }

  const endPointerDrag = (event: PointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current
    if (dragState.pointerId !== event.pointerId) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    dragStateRef.current = {
      itemId: null,
      pointerId: null,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      didMove: false,
    }

    window.requestAnimationFrame(() => {
      setDraggingRestaurantId(null)
    })
  }

  if (!open) {
    return null
  }

  return (
    <div className="list-edit-sheet" role="presentation">
      <button type="button" className="list-edit-sheet__backdrop" aria-label={t('shared.close')} onClick={onClose} />

      <section className="list-edit-sheet__panel" role="dialog" aria-modal="true" aria-label={t('listDetail.edit')}>
        <div className="list-edit-sheet__handle" aria-hidden="true" />

        <header className="list-edit-sheet__header screen-header">
          <div className="screen-header__slot">
            <button type="button" className="screen-header__button" aria-label={t('shared.close')} onClick={onClose}>
              <img src={closeIcon} alt="" aria-hidden="true" />
            </button>
          </div>

          <div className="screen-header__slot screen-header__slot--auto">
            <button
              type="button"
              className={`list-edit-sheet__confirm ${hasChanges ? 'is-active' : ''}`}
              aria-label={t('shared.save')}
              disabled={!hasChanges}
              onClick={commitSave}
            >
              <img src={topCheckIcon} alt="" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="list-edit-sheet__body">
          <section className="list-edit-sheet__hero" aria-label={listItem.title}>
            <img className="list-edit-sheet__cover" src={listItem.image || coverImage} alt="" aria-hidden="true" />

            <div className="list-edit-sheet__title-block">
              {isTitleEditing ? (
                <input
                  className="list-edit-sheet__title-input"
                  type="text"
                  value={draftTitle}
                  autoFocus
                  onBlur={() => setIsTitleEditing(false)}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.currentTarget.blur()
                    }
                  }}
                />
              ) : (
                <button type="button" className="list-edit-sheet__title-button" onClick={() => setIsTitleEditing(true)}>
                  {draftTitle || listItem.title}
                </button>
              )}
              <p className="list-edit-sheet__owner">{listItem.owner}</p>
              <p className="list-edit-sheet__date">{listItem.date}</p>
            </div>
          </section>

          <section className="list-edit-sheet__settings" aria-label={t('list.listSettings')}>
            <div className="my-edit__row list-edit-sheet__row">
              <span>{t('list.publishList')}</span>
              <button
                type="button"
                className={`my-edit__switch ${isPublished ? 'is-on' : ''}`}
                aria-label={t('list.publishList')}
                aria-pressed={isPublished}
                onClick={() => setIsPublished((current) => !current)}
              >
                <span />
              </button>
            </div>
          </section>

          <section className="list-edit-sheet__restaurants" aria-label={t('listDetail.restaurants')}>
            <header className="list-edit-sheet__list-header">
              <button type="button" className="list-edit-sheet__select-all" aria-pressed={allSelected} onClick={toggleSelectAll}>
                <span className="list-edit-sheet__select-all-check" aria-hidden="true">
                  <img src={allSelected ? checkActiveIcon : checkDefaultIcon} alt="" aria-hidden="true" />
                </span>
                <span className="list-edit-sheet__select-all-label">{t('shared.selectAll')}</span>
              </button>
              <div className="list-edit-sheet__selected-count">{t('shared.selected', { count: selectedCount })}</div>
            </header>

            <div className="list-edit-sheet__items">
              {draftRestaurants.map((item) => {
                const isSelected = selectedRestaurantIds.includes(item.id)

                return (
                  <article
                    key={item.id}
                    data-list-edit-item-id={item.id}
                    className={`list-edit-sheet__item ${isSelected ? 'is-selected' : ''} ${draggingRestaurantId === item.id ? 'is-dragging' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={() => {
                      if (dragStateRef.current.didMove) {
                        return
                      }

                      toggleRestaurantSelection(item.id)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        toggleRestaurantSelection(item.id)
                      }
                    }}
                  >
                    <span className="list-edit-sheet__item-check" aria-hidden="true">
                      <img src={isSelected ? checkActiveIcon : checkDefaultIcon} alt="" aria-hidden="true" />
                    </span>
                    <span className="list-edit-sheet__item-icon" style={{ '--place-icon-bg': 'var(--color-point-restaurant)' } as CSSProperties}>
                      <img src={item.icon} alt="" aria-hidden="true" />
                    </span>
                    <span className="list-edit-sheet__item-content">
                      <span className="list-edit-sheet__item-title">{item.name}</span>
                      <span className="list-edit-sheet__item-meta">
                      <span>{item.category === 'Cafe' ? t('map.filters.cafe') : t('map.filters.food')}</span>
                        <span className="text-dot" aria-hidden="true" />
                        {item.address}
                      </span>
                    </span>
                    <button
                      type="button"
                      className="list-edit-sheet__item-sort"
                      aria-label={t('list.reorderRestaurant', { name: item.name })}
                      data-drag-handle-for={item.id}
                      onPointerDown={(event) => startPointerDrag(event, item.id)}
                      onPointerMove={updatePointerDrag}
                      onPointerUp={endPointerDrag}
                      onPointerCancel={endPointerDrag}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <img src={alignIcon} alt="" aria-hidden="true" />
                    </button>
                  </article>
                )
              })}
            </div>
          </section>
        </div>

        <button
          type="button"
          className="list-edit-sheet__trash"
          aria-label={t('list.deleteSelectedRestaurants')}
          disabled={selectedCount === 0}
          onClick={deleteSelectedRestaurants}
        >
          <img src={deleteIcon} alt="" aria-hidden="true" />
        </button>
      </section>
    </div>
  )
}
