import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import addToIcon from '../assets/icons/ico-top-add.svg'
import moreDotsIconLg from '../assets/icons/ico-more-dots-lg.svg'
import editIcon from '../assets/icons/ico-context-edit.svg'
import deleteRedIcon from '../assets/icons/ico-delete-red.svg'
import albumCoverLikeImage from '../assets/images/album-cover-like.png'
import albumCoverCheckImage from '../assets/images/album-cover-check.png'
import albumCoverImage from '../assets/dummy/photo-cover.jpg'
import { ListAddPage } from './ListAddPage'
import { ListDetailPage } from './ListDetailPage'
import { type LovedListItem } from './LovedListDetailPage'
import { useLongPress } from '../hooks/useLongPress'
import './ExplorePage.css'
import './ListPage.css'

const initialLists: LovedListItem[] = [
  { id: 'my-list-1', title: 'Sunny mood', owner: 'halo', date: '2025-11-12', count: 12, image: albumCoverImage },
  { id: 'my-list-2', title: 'Like', owner: 'halo', date: '2026.08.19', count: 8, image: albumCoverLikeImage },
  { id: 'my-list-3', title: 'My Registered Place', owner: 'halo', date: '2026.08.15', count: 3, image: albumCoverCheckImage },
]

type ListPageProps = {
  onAddRestaurant: (listId: string) => void
  onAddToList: () => void
  onViewListOnMap: (listItem: LovedListItem) => void
  onBottomNavVisibilityChange: (isVisible: boolean) => void
  restoreSelectedListId: string | null
  onRestoreSelectedListIdHandled: () => void
}

type DragState = {
  itemId: string
  pointerId: number
  currentX: number
  currentY: number
} | null

const moveItem = (items: LovedListItem[], draggedId: string, targetId: string, insertAfter: boolean) => {
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

type ListCardProps = {
  listItem: LovedListItem
  isEditing: boolean
  isDragging: boolean
  onOpen: (listId: string) => void
  onDelete: (listId: string) => void
  onEnterEdit: (listId: string, event: PointerEvent<HTMLElement>) => void
  onStartDrag: (listId: string, event: PointerEvent<HTMLElement>) => void
  onMoveDrag: (listId: string, event: PointerEvent<HTMLElement>) => void
  onEndDrag: (listId: string, event: PointerEvent<HTMLElement>) => void
}

function ListCard({
  listItem,
  isEditing,
  isDragging,
  onOpen,
  onDelete,
  onEnterEdit,
  onStartDrag,
  onMoveDrag,
  onEndDrag,
}: ListCardProps) {
  const longPress = useLongPress(
    (event) => {
      onEnterEdit(listItem.id, event)
    },
    { delay: 520, moveThreshold: 16, disabled: isEditing },
  )

  const handlePointerDown = isEditing
    ? (event: PointerEvent<HTMLElement>) => {
        onStartDrag(listItem.id, event)
      }
    : longPress.onPointerDown

  const handlePointerMove = isEditing
    ? (event: PointerEvent<HTMLElement>) => {
        onMoveDrag(listItem.id, event)
      }
    : longPress.onPointerMove

  const handlePointerUp = isEditing
    ? (event: PointerEvent<HTMLElement>) => {
        onEndDrag(listItem.id, event)
      }
    : longPress.onPointerUp

  const handlePointerCancel = isEditing
    ? (event: PointerEvent<HTMLElement>) => {
        onEndDrag(listItem.id, event)
      }
    : longPress.onPointerCancel

  return (
    <article
      className={`my-list-card ${isEditing ? 'is-editing' : ''} ${isDragging ? 'is-dragging' : ''}`}
      data-list-card-id={listItem.id}
      role="button"
      tabIndex={0}
      onClick={() => {
        if (isEditing || isDragging) {
          return
        }

        onOpen(listItem.id)
      }}
      onKeyDown={(event) => {
        if (isEditing) {
          return
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(listItem.id)
        }
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onContextMenu={isEditing ? (event) => event.preventDefault() : longPress.onContextMenu}
    >
      <div className="my-list-card__media">
        <img src={listItem.image} alt="" aria-hidden="true" />
        <span className="my-list-card__count">{listItem.count}</span>
        {isEditing && (
          <button
            type="button"
            className="my-list-card__delete"
            aria-label={`Delete ${listItem.title}`}
            onClick={(event) => {
              event.stopPropagation()
              onDelete(listItem.id)
            }}
          >
            <img src={deleteRedIcon} alt="" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="my-list-cover-content">
        <h3>{listItem.title}</h3>
        <p>{listItem.owner}</p>
      </div>
    </article>
  )
}

export function ListPage({
  onAddRestaurant,
  onAddToList,
  onViewListOnMap,
  onBottomNavVisibilityChange,
  restoreSelectedListId,
  onRestoreSelectedListIdHandled,
}: ListPageProps) {
  const [myLists, setMyLists] = useState<LovedListItem[]>(initialLists)
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [isAddListOpen, setIsAddListOpen] = useState(false)
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  const [isEditingLists, setIsEditingLists] = useState(false)
  const [draggingListId, setDraggingListId] = useState<string | null>(null)
  const dragStateRef = useRef<DragState>(null)
  const selectedList = selectedListId ? myLists.find((listItem) => listItem.id === selectedListId) ?? null : null

  useEffect(() => {
    onBottomNavVisibilityChange(!selectedListId && !isAddListOpen && !restoreSelectedListId)
  }, [onBottomNavVisibilityChange, isAddListOpen, restoreSelectedListId, selectedListId])

  useEffect(() => {
    if (!restoreSelectedListId || selectedListId) {
      return
    }

    const restoredList = myLists.find((listItem) => listItem.id === restoreSelectedListId) ?? null
    if (restoredList) {
      setSelectedListId(restoredList.id)
    }

    onRestoreSelectedListIdHandled()
  }, [myLists, onRestoreSelectedListIdHandled, restoreSelectedListId, selectedListId])

  const handleSaveList = (updatedListItem: LovedListItem) => {
    setMyLists((currentLists) =>
      currentLists.map((listItem) => (listItem.id === updatedListItem.id ? updatedListItem : listItem)),
    )
  }

  const enterEditMode = (listId: string, event: PointerEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsHeaderMenuOpen(false)
    setIsEditingLists(true)
    setDraggingListId(listId)
    dragStateRef.current = {
      itemId: listId,
      pointerId: event.pointerId,
      currentX: event.clientX,
      currentY: event.clientY,
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const beginDrag = (listId: string, event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    setDraggingListId(listId)
    dragStateRef.current = {
      itemId: listId,
      pointerId: event.pointerId,
      currentX: event.clientX,
      currentY: event.clientY,
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const reorderByPointer = (pointerX: number, pointerY: number) => {
    const hoveredElement = document
      .elementFromPoint(pointerX, pointerY)
      ?.closest<HTMLElement>('[data-list-card-id]')

    const draggedId = dragStateRef.current?.itemId
    const targetId = hoveredElement?.dataset.listCardId ?? null

    if (!draggedId || !targetId || draggedId === targetId || !hoveredElement) {
      return
    }

    const targetRect = hoveredElement.getBoundingClientRect()
    const insertAfter = pointerY > targetRect.top + targetRect.height / 2

    setMyLists((currentLists) => moveItem(currentLists, draggedId, targetId, insertAfter))
  }

  const moveDrag = (listId: string, event: PointerEvent<HTMLElement>) => {
    const dragState = dragStateRef.current
    if (!dragState || dragState.itemId !== listId || dragState.pointerId !== event.pointerId) {
      return
    }

    dragState.currentX = event.clientX
    dragState.currentY = event.clientY
    reorderByPointer(event.clientX, event.clientY)
  }

  const endDrag = (listId: string, event: PointerEvent<HTMLElement>) => {
    const dragState = dragStateRef.current
    if (!dragState || dragState.itemId !== listId || dragState.pointerId !== event.pointerId) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    dragStateRef.current = null
    setDraggingListId(null)
  }

  const exitEditMode = (event: MouseEvent<HTMLElement>) => {
    if (!isEditingLists || event.target !== event.currentTarget) {
      return
    }

    setIsEditingLists(false)
    setDraggingListId(null)
    dragStateRef.current = null
  }

  if (isAddListOpen) {
    return <ListAddPage onClose={() => setIsAddListOpen(false)} />
  }

  if (selectedList) {
    return (
      <ListDetailPage
        listItem={selectedList}
        onBack={() => {
          setSelectedListId(null)
        }}
        onAddRestaurant={onAddRestaurant}
        onAddToList={onAddToList}
        onViewOnMap={onViewListOnMap}
        onSaveList={handleSaveList}
      />
    )
  }

  return (
    <div className={`list-page popular-restaurant-page ${isEditingLists ? 'is-editing' : ''}`} onClick={() => setIsHeaderMenuOpen(false)}>
      <header className="list-page__header">
        <h1 className="page-title">List</h1>

        <div className="list-page__actions" onClick={(event) => event.stopPropagation()}>
          <button
            type="button"
            className="screen-header__button"
            aria-label="Add list"
            onClick={() => {
              setIsHeaderMenuOpen(false)
              setIsAddListOpen(true)
            }}
          >
            <img src={addToIcon} alt="" aria-hidden="true" />
          </button>

          <div className="list-page__menu-wrap">
            <button
              type="button"
              className="screen-header__button"
              aria-label="More options"
              aria-expanded={isHeaderMenuOpen}
              onClick={() => setIsHeaderMenuOpen((current) => !current)}
            >
              <img src={moreDotsIconLg} alt="" aria-hidden="true" />
            </button>

            {isHeaderMenuOpen && (
              <>
                <button
                  type="button"
                  className="list-page__menu-backdrop"
                  aria-label="Close list menu"
                  onClick={() => setIsHeaderMenuOpen(false)}
                />
                <div className="list-page__menu" role="menu" aria-label="List options">
                  <button
                    type="button"
                    className={`list-page__menu-item ${isEditingLists ? 'is-active' : ''}`}
                    role="menuitem"
                    aria-pressed={isEditingLists}
                    onClick={() => {
                      setIsHeaderMenuOpen(false)
                      setIsEditingLists((current) => !current)
                    }}
                  >
                    <span className="list-page__menu-icon" aria-hidden="true">
                      <img src={editIcon} alt="" aria-hidden="true" />
                    </span>
                    <span>edit list</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="popular-restaurant-page__content list-page__content" onClick={exitEditMode}>
        <div className={`explore-loved list-page__grid ${isEditingLists ? 'is-editing' : ''}`}>
          {myLists.map((listItem) => (
            <ListCard
              key={listItem.id}
              listItem={listItem}
              isEditing={isEditingLists}
              isDragging={draggingListId === listItem.id}
              onOpen={(listId) => setSelectedListId(listId)}
              onDelete={(listId) => {
                setMyLists((currentLists) => currentLists.filter((item) => item.id !== listId))
                if (selectedListId === listId) {
                  setSelectedListId(null)
                }
              }}
              onEnterEdit={enterEditMode}
              onStartDrag={beginDrag}
              onMoveDrag={moveDrag}
              onEndDrag={endDrag}
            />
          ))}
        </div>
      </main>

    </div>
  )
}
