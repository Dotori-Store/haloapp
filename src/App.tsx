import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from 'react'
import mapBackground from './assets/images/map-backgound.png'
import foodIcon from './assets/icons/ico-cat-food.svg'
import cafeIcon from './assets/icons/ico-cat-cafe.svg'
import prayerIcon from './assets/icons/ico-cat-prayer.svg'
import myLocationIcon from './assets/icons/ico-my-location.svg'
import keepIcon from './assets/icons/ico-keep.svg'
import keepActiveIcon from './assets/icons/ico-keep-active.svg'
import checkActiveIcon from './assets/icons/ico-check-xs-active.svg'
import cautionIcon from './assets/icons/ico-caution-lg.svg'
import rightArrowIcon from './assets/icons/ico-right-arrow.svg'
import glassIcon from './assets/icons/ico-glass-gray.svg'
import handLikeIcon from './assets/icons/ico-hand-like.svg'
import cameraIcon from './assets/icons/ico-camera.svg'
import fileIcon from './assets/icons/ico-file.svg'
import photoIcon from './assets/icons/ico-photo-light.svg'
import searchBackIcon from './assets/icons/ico-search-back.svg'
import deleteTextIcon from './assets/icons/ico-delete-text.svg'
import closeIcon from './assets/icons/ico-close-xs.svg'
import unhappyIcon from './assets/icons/ico-unhappy.svg'
import albumCover from './assets/dummy/album-cover.jpg'
import { BottomNav, type BottomNavTab } from './components/BottomNav'
import { ExplorePage } from './components/ExplorePage'
import { ListPage } from './components/ListPage'
import { RestaurantAddPage } from './components/RestaurantAddPage'
import { MyPage } from './components/MyPage'
import { PlaceDetailSheet } from './components/PlaceDetailSheet'
import { nearbyPlaces, searchResultPlaces, type NearbyPlace } from './data/places'
import './App.css'

type Category = 'all' | 'food' | 'cafe' | 'prayer'
type SheetMode = 'collapsed' | 'expanded' | 'search'

type Place = {
  id: string
  name: string
  category: Exclude<Category, 'all'>
  x: number
  y: number
  icon: string
}

const places: Place[] = [
  { id: 'food-1', name: 'Korean BBQ', category: 'food', x: 22, y: 51, icon: foodIcon },
  { id: 'food-2', name: 'Tasty Noodle', category: 'food', x: 71, y: 58, icon: foodIcon },
  { id: 'cafe-1', name: 'Morning Bean', category: 'cafe', x: 61, y: 40, icon: cafeIcon },
  { id: 'cafe-2', name: 'Quiet Brew', category: 'cafe', x: 35, y: 68, icon: cafeIcon },
  { id: 'prayer-1', name: 'Peace Place', category: 'prayer', x: 80, y: 34, icon: prayerIcon },
]

const DRAG_START_THRESHOLD = 24
const SHEET_SNAP_THRESHOLD = 140

const copy = {
  title: 'Map screen',
  myLocation: 'My location',
  filterLabel: 'Category filter',
  filters: {
    all: 'All',
    food: 'Restaurant',
    cafe: 'Cafe',
    prayer: 'Prayer',
  },
  searchPlaceholder: 'Search',
  nearbyTitle: 'Nearby places',
  recommend: "Can't find it? Recommend!",
}

const savedLists = [
  { id: 'list-1', title: 'Rainy Day Cafe' },
  { id: 'list-2', title: 'Drive' },
  { id: 'list-3', title: 'Spring Day' },
  { id: 'list-4', title: 'Rose' },
]

const getPlaceIconBackground = () => 'var(--color-point-restaurant)'

function App() {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('map')
  const [activeFilter, setActiveFilter] = useState<Category>('all')
  const [sheetMode, setSheetMode] = useState<SheetMode>('collapsed')
  const [searchQuery, setSearchQuery] = useState('')
  const [keptSearchResultIds, setKeptSearchResultIds] = useState<string[]>([])
  const [wishedPlaceIds, setWishedPlaceIds] = useState<string[]>([])
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [isDetailExpanded, setIsDetailExpanded] = useState(false)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [isAddToListOpen, setIsAddToListOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isRestaurantAddOpen, setIsRestaurantAddOpen] = useState(false)
  const [reportComment, setReportComment] = useState('')
  const [selectedListId, setSelectedListId] = useState<string>('')
  const [savedListToast, setSavedListToast] = useState<{ title: string; phase: 'enter' | 'visible' | 'exit' } | null>(null)
  const dragStartY = useRef<number | null>(null)
  const dragPointerId = useRef<number | null>(null)
  const didDragSheet = useRef(false)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const toastTimerRef = useRef<number | null>(null)
  const toastExitTimerRef = useRef<number | null>(null)
  const confirmListTimerRef = useRef<number | null>(null)

  useEffect(() => {
    document.documentElement.lang = navigator.language.startsWith('ko') ? 'ko' : 'en'
  }, [])

  useEffect(() => {
    if (sheetMode !== 'search') {
      return
    }

    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
  }, [sheetMode])

  useEffect(() => {
    if (!savedListToast) {
      return
    }

    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current)
    }
    if (toastExitTimerRef.current !== null) {
      window.clearTimeout(toastExitTimerRef.current)
    }

    toastTimerRef.current = window.setTimeout(() => {
      toastTimerRef.current = null
      setSavedListToast((currentToast) => (currentToast ? { ...currentToast, phase: 'exit' } : currentToast))

      toastExitTimerRef.current = window.setTimeout(() => {
        setSavedListToast(null)
        toastExitTimerRef.current = null
      }, 160)
    }, 4000)

    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current)
        toastTimerRef.current = null
      }
      if (toastExitTimerRef.current !== null) {
        window.clearTimeout(toastExitTimerRef.current)
        toastExitTimerRef.current = null
      }
    }
  }, [savedListToast])

  useEffect(() => {
    return () => {
      if (confirmListTimerRef.current !== null) {
        window.clearTimeout(confirmListTimerRef.current)
        confirmListTimerRef.current = null
      }
    }
  }, [])

  const visiblePlaces = useMemo(() => {
    if (activeFilter === 'all') {
      return places
    }

    return places.filter((place) => place.category === activeFilter)
  }, [activeFilter])

  const selectedPlace = nearbyPlaces.find((place) => place.id === selectedPlaceId) ?? null
  const isDetail = selectedPlace !== null
  const isExpanded = sheetMode === 'expanded'
  const isSearch = sheetMode === 'search' && !isDetail
  const hasSearchQuery = searchQuery.trim().length > 0
  const detailSheetHeight = selectedPlace?.photoUrl ? '480px' : '430px'
  const sheetHeight = isDetail ? detailSheetHeight : sheetMode === 'collapsed' ? '168px' : '450px'
  const stageStyle = { '--map-sheet-height': sheetHeight } as CSSProperties

  const resetDrag = () => {
    dragStartY.current = null
    dragPointerId.current = null

    window.requestAnimationFrame(() => {
      didDragSheet.current = false
    })
  }

  const startSheetDrag = (event: PointerEvent<HTMLDivElement>) => {
    dragStartY.current = event.clientY
    dragPointerId.current = event.pointerId
    didDragSheet.current = false

    const interactiveTarget = event.target instanceof HTMLElement
      ? event.target.closest('.map-search, .nearby-item, .place-detail, button, input')
      : null

    if (!interactiveTarget) {
      event.currentTarget.setPointerCapture(event.pointerId)
    }
  }

  const moveSheetDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null || dragPointerId.current !== event.pointerId) {
      return
    }

    const dragDistance = dragStartY.current - event.clientY
    if (Math.abs(dragDistance) >= DRAG_START_THRESHOLD) {
      didDragSheet.current = true
    }
  }

  const finishSheetDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null || dragPointerId.current !== event.pointerId) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const dragDistance = dragStartY.current - event.clientY
    if (isDetail) {
      if (dragDistance > SHEET_SNAP_THRESHOLD) {
        setIsDetailExpanded(true)
      }

      if (dragDistance < -SHEET_SNAP_THRESHOLD) {
        if (isDetailExpanded) {
          setIsDetailExpanded(false)
        } else {
          setSelectedPlaceId(null)
        }
      }

      resetDrag()
      return
    }

    if (dragDistance > SHEET_SNAP_THRESHOLD && sheetMode === 'collapsed') {
      setSheetMode('expanded')
    }

    if (dragDistance > SHEET_SNAP_THRESHOLD && sheetMode === 'expanded') {
      setSheetMode('search')
    }

    if (dragDistance < -SHEET_SNAP_THRESHOLD) {
      setSheetMode('collapsed')
    }

    resetDrag()
  }

  const openSearch = () => {
    setActiveTab('map')
    setSelectedPlaceId(null)
    setIsDetailExpanded(false)
    setIsPhotoModalOpen(false)
    setIsAddToListOpen(false)
    setSheetMode((currentMode) => (currentMode === 'collapsed' ? 'expanded' : 'search'))
  }

  const closeSearch = () => {
    setActiveTab('map')
    setSearchQuery('')
    setSelectedPlaceId(null)
    setIsDetailExpanded(false)
    setIsPhotoModalOpen(false)
    setIsAddToListOpen(false)
    setIsReportModalOpen(false)
    setSheetMode('collapsed')
  }

  const openPlaceDetail = (placeId: string) => {
    setActiveTab('map')
    setSelectedPlaceId(placeId)
    setIsDetailExpanded(false)
    setIsPhotoModalOpen(false)
    setIsAddToListOpen(false)
    setIsReportModalOpen(false)
    setSheetMode('expanded')
  }

  const closePlaceDetail = () => {
    setActiveTab('map')
    setSelectedPlaceId(null)
    setIsDetailExpanded(false)
    setIsPhotoModalOpen(false)
    setIsAddToListOpen(false)
    setIsReportModalOpen(false)
    setSheetMode('expanded')
  }

  const openPhotoModal = () => {
    setActiveTab('map')
    setIsAddToListOpen(false)
    setIsReportModalOpen(false)
    setIsPhotoModalOpen(true)
  }

  const closePhotoModal = () => {
    setIsPhotoModalOpen(false)
  }

  const openReportModal = () => {
    setIsPhotoModalOpen(false)
    setIsAddToListOpen(false)
    setReportComment('')
    setIsReportModalOpen(true)
  }

  const closeReportModal = () => {
    setIsReportModalOpen(false)
    setReportComment('')
  }

  const closeAddToList = () => {
    if (confirmListTimerRef.current !== null) {
      window.clearTimeout(confirmListTimerRef.current)
      confirmListTimerRef.current = null
    }

    setIsAddToListOpen(false)
    setSelectedListId('')
  }

  const confirmAddToList = (listId: string, listTitle: string) => {
    if (confirmListTimerRef.current !== null) {
      window.clearTimeout(confirmListTimerRef.current)
      confirmListTimerRef.current = null
    }

    setSelectedListId(listId)

    confirmListTimerRef.current = window.setTimeout(() => {
      confirmListTimerRef.current = null
      setSavedListToast({ title: listTitle, phase: 'enter' })
      setIsAddToListOpen(false)
      setSelectedListId('')
    }, 140)
  }

  const openListSheet = () => {
    setIsPhotoModalOpen(false)
    setIsReportModalOpen(false)
    setReportComment('')
    setSavedListToast(null)
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current)
      toastTimerRef.current = null
    }
    if (toastExitTimerRef.current !== null) {
      window.clearTimeout(toastExitTimerRef.current)
      toastExitTimerRef.current = null
    }
    if (confirmListTimerRef.current !== null) {
      window.clearTimeout(confirmListTimerRef.current)
      confirmListTimerRef.current = null
    }
    setIsAddToListOpen(true)
    setSelectedListId('')
  }

  const openRestaurantAddPage = () => {
    setIsPhotoModalOpen(false)
    setIsAddToListOpen(false)
    setIsReportModalOpen(false)
    setSavedListToast(null)
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current)
      toastTimerRef.current = null
    }
    if (toastExitTimerRef.current !== null) {
      window.clearTimeout(toastExitTimerRef.current)
      toastExitTimerRef.current = null
    }
    setIsRestaurantAddOpen(true)
  }

  const closeRestaurantAddPage = () => {
    setIsRestaurantAddOpen(false)
  }

  const closeSavedListToast = () => {
    setSavedListToast(null)
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current)
      toastTimerRef.current = null
    }
    if (toastExitTimerRef.current !== null) {
      window.clearTimeout(toastExitTimerRef.current)
      toastExitTimerRef.current = null
    }
  }

  const toggleWishedPlace = (placeId: string) => {
    setWishedPlaceIds((currentIds) =>
      currentIds.includes(placeId) ? currentIds.filter((id) => id !== placeId) : [...currentIds, placeId],
    )
  }

  const handlePlaceClick = (place: NearbyPlace) => {
    if (place.id === 'nearby-1' || place.id === 'nearby-2' || place.id === 'nearby-3') {
      openPlaceDetail(place.id)
    }
  }

  const handleSearchResultKeepClick = (event: MouseEvent<HTMLButtonElement>, placeId: string) => {
    event.stopPropagation()
    setKeptSearchResultIds((currentIds) =>
      currentIds.includes(placeId) ? currentIds.filter((id) => id !== placeId) : [...currentIds, placeId],
    )
  }

  const renderKeepButton = (place: NearbyPlace) => (
    <button
      type="button"
      className="nearby-item__keep"
      aria-label={`Save ${place.name} to list`}
      aria-haspopup="dialog"
      onClick={(event) => {
        event.stopPropagation()
        openListSheet()
      }}
    >
      <img src={keepIcon} alt="" aria-hidden="true" />
    </button>
  )

  const renderSearchResultItem = (place: NearbyPlace) => (
    <article className="nearby-item" key={place.id}>
      <span className="nearby-item__icon" style={{ '--place-icon-bg': getPlaceIconBackground() } as CSSProperties}>
        <img src={foodIcon} alt="" aria-hidden="true" />
      </span>
      <div className="nearby-item__content">
        <h3>{place.name}</h3>
        <p>
          <span className={place.status === 'Open' ? 'is-open' : 'is-closed'}>{place.status}</span>
          <span className="text-dot" aria-hidden="true" />
          {place.address}
        </p>
      </div>
      <button
        type="button"
        className={`nearby-item__keep ${keptSearchResultIds.includes(place.id) ? 'is-active' : ''}`}
        aria-label={`${keptSearchResultIds.includes(place.id) ? 'Unkeep' : 'Keep'} ${place.name}`}
        aria-pressed={keptSearchResultIds.includes(place.id)}
        onClick={(event) => handleSearchResultKeepClick(event, place.id)}
      >
        <img src={keptSearchResultIds.includes(place.id) ? keepActiveIcon : keepIcon} alt="" aria-hidden="true" />
      </button>
    </article>
  )

  const renderNearbyItem = (place: NearbyPlace) => (
    <article
      className={`nearby-item ${place.id === 'nearby-1' || place.id === 'nearby-2' || place.id === 'nearby-3' ? 'is-clickable' : ''}`}
      key={place.id}
      role={place.id === 'nearby-1' || place.id === 'nearby-2' || place.id === 'nearby-3' ? 'button' : undefined}
      tabIndex={place.id === 'nearby-1' || place.id === 'nearby-2' || place.id === 'nearby-3' ? 0 : undefined}
      onClick={() => handlePlaceClick(place)}
      onKeyDown={(event) => {
        if ((place.id === 'nearby-1' || place.id === 'nearby-2' || place.id === 'nearby-3') && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          openPlaceDetail(place.id)
        }
      }}
    >
      <span className="nearby-item__icon" style={{ '--place-icon-bg': getPlaceIconBackground() } as CSSProperties}>
        <img src={foodIcon} alt="" aria-hidden="true" />
      </span>
      <div className="nearby-item__content">
        <h3>{place.name}</h3>
        <p>
          <span className={place.status === 'Open' ? 'is-open' : 'is-closed'}>{place.status}</span>
          <span className="text-dot" aria-hidden="true" />
          {place.address}
        </p>
      </div>
      {renderKeepButton(place)}
    </article>
  )

  const openExplore = () => {
    setActiveTab('explore')
    setSheetMode('collapsed')
    setSelectedPlaceId(null)
    setIsDetailExpanded(false)
    setIsPhotoModalOpen(false)
    setIsAddToListOpen(false)
    setIsReportModalOpen(false)
    setSearchQuery('')
  }

  const openListTab = () => {
    setActiveTab('list')
    setSheetMode('collapsed')
    setSelectedPlaceId(null)
    setIsDetailExpanded(false)
    setIsPhotoModalOpen(false)
    setIsAddToListOpen(false)
    setIsReportModalOpen(false)
    setSearchQuery('')
  }

  const openMy = () => {
    setActiveTab('my')
    setSheetMode('collapsed')
    setSelectedPlaceId(null)
    setIsDetailExpanded(false)
    setIsPhotoModalOpen(false)
    setIsAddToListOpen(false)
    setIsReportModalOpen(false)
    setSearchQuery('')
  }

  const openMap = () => {
    setActiveTab('map')
    setSheetMode('collapsed')
  }

  const handleBottomNavChange = (tab: BottomNavTab) => {
    setIsRestaurantAddOpen(false)

    if (tab === 'explore') {
      openExplore()
      return
    }

    if (tab === 'map') {
      openMap()
      return
    }

    if (tab === 'list') {
      openListTab()
      return
    }

    if (tab === 'my') {
      openMy()
    }
  }

  return (
    <div className="map-shell">
      {isRestaurantAddOpen ? (
        <RestaurantAddPage onClose={closeRestaurantAddPage} />
      ) : activeTab === 'explore' ? (
        <ExplorePage onAddToList={openListSheet} onReportIncorrect={openReportModal} />
      ) : activeTab === 'list' ? (
        <ListPage onAddRestaurant={openRestaurantAddPage} onAddToList={openListSheet} />
      ) : activeTab === 'my' ? (
        <MyPage onReportIncorrect={openReportModal} onAddToList={openListSheet} />
      ) : (
        <section
          className={`map-stage ${isSearch ? 'is-searching' : ''} ${isDetail ? 'is-detail' : ''}`}
          aria-label={copy.title}
          style={stageStyle}
        >
          <div className="map-background" style={{ backgroundImage: `url(${mapBackground})` }}>
            <div className="map-overlay" />

            {visiblePlaces.map((place) => (
              <button
                key={place.id}
                type="button"
                className={`map-marker map-marker-${place.category}`}
                style={{ left: `${place.x}%`, top: `${place.y}%` }}
                aria-label={place.name}
                onClick={() => {
                  if (place.id === 'food-1') {
                    openPlaceDetail('nearby-1')
                  }
                }}
              >
                <span className="map-marker-inner">
                  <img src={place.icon} alt="" aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>

          <div className="filter-bar">
            <div className="filter-group" role="tablist" aria-label={copy.filterLabel}>
              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === 'all'}
                className={activeFilter === 'all' ? 'is-active' : ''}
                onClick={() => setActiveFilter('all')}
              >
                {copy.filters.all}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === 'food'}
                className={activeFilter === 'food' ? 'is-active' : ''}
                onClick={() => setActiveFilter('food')}
              >
                <img src={foodIcon} alt="" aria-hidden="true" />
                {copy.filters.food}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === 'cafe'}
                className={activeFilter === 'cafe' ? 'is-active' : ''}
                onClick={() => setActiveFilter('cafe')}
              >
                <img src={cafeIcon} alt="" aria-hidden="true" />
                {copy.filters.cafe}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === 'prayer'}
                className={activeFilter === 'prayer' ? 'is-active' : ''}
                onClick={() => setActiveFilter('prayer')}
              >
                <img src={prayerIcon} alt="" aria-hidden="true" />
                {copy.filters.prayer}
              </button>
            </div>
            <button type="button" className="my-location" aria-label={copy.myLocation}>
              <img src={myLocationIcon} alt="" aria-hidden="true" />
            </button>
          </div>

          <div
            className={`map-sheet ${isSearch ? 'is-searching' : ''} ${isDetail ? 'is-detail' : ''} ${isDetailExpanded ? 'is-detail-expanded' : ''}`}
            onPointerDown={startSheetDrag}
            onPointerMove={moveSheetDrag}
            onPointerUp={finishSheetDrag}
            onPointerCancel={resetDrag}
          >
            <div className="map-handle" aria-hidden="true" />
            <div className="map-sheet-body">
              {selectedPlace ? (
                <PlaceDetailSheet
                  place={selectedPlace}
                  isWished={wishedPlaceIds.includes(selectedPlace.id)}
                  isExpanded={isDetailExpanded}
                  onClose={closePlaceDetail}
                  onAddPhoto={openPhotoModal}
                  onToggleWish={() => toggleWishedPlace(selectedPlace.id)}
                  onAddToList={openListSheet}
                  onReportIncorrect={openReportModal}
                />
              ) : isSearch ? (
                <>
                  <div className="map-search search-field">
                    <button type="button" className="search-back" aria-label="Close search" onClick={closeSearch}>
                      <img src={searchBackIcon} alt="" aria-hidden="true" />
                    </button>
                    <input
                      ref={searchInputRef}
                      aria-label="Search places"
                      className="search-input"
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="search-clear"
                        aria-label="Clear search"
                        onClick={() => setSearchQuery('')}
                      >
                        <img src={deleteTextIcon} alt="" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <div className="search-results">
                    {hasSearchQuery ? (
                      <div className="no-results" role="status">
                        <img src={unhappyIcon} alt="" aria-hidden="true" />
                        <p>No Result found</p>
                      </div>
                    ) : (
                      <div className="nearby-list nearby-list--search">{searchResultPlaces.map(renderSearchResultItem)}</div>
                    )}
                  </div>
                  <div className="recommend-bottom">
                    <button type="button" className="recommend-button">
                      <img src={handLikeIcon} alt="" aria-hidden="true" />
                      {copy.recommend}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="map-search"
                    onClick={() => {
                      if (didDragSheet.current) {
                        return
                      }

                      openSearch()
                    }}
                  >
                    <img src={glassIcon} alt="" aria-hidden="true" />
                    <span>{copy.searchPlaceholder}</span>
                  </button>
                  {isExpanded && (
                    <section className="nearby-places" aria-label={copy.nearbyTitle}>
                      <h2 className="section-title">{copy.nearbyTitle}</h2>
                      <div className="nearby-list">{nearbyPlaces.slice(0, 4).map(renderNearbyItem)}</div>
                    </section>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      )}
      <BottomNav activeTab={activeTab} onChangeTab={handleBottomNavChange} onAdd={openRestaurantAddPage} />

        {isPhotoModalOpen && (
          <div className="photo-modal-backdrop" role="presentation" onMouseDown={closePhotoModal}>
            <div
              className="photo-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Add Photo"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button type="button" className="photo-modal__option" aria-label="Open photo library">
                <img src={cameraIcon} alt="" aria-hidden="true" />
                <span>Photo Library</span>
              </button>
              <button type="button" className="photo-modal__option" aria-label="Open file library">
                <img src={fileIcon} alt="" aria-hidden="true" />
                <span>File Library</span>
              </button>
            </div>
          </div>
        )}

        {isReportModalOpen && (
          <div className="report-modal-backdrop" role="presentation" onMouseDown={closeReportModal}>
            <div
              className="report-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Report incorrect information"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button type="button" className="report-modal__close" aria-label="Close" onClick={closeReportModal}>
                <img src={closeIcon} alt="" aria-hidden="true" />
              </button>

              <img className="report-modal__icon" src={cautionIcon} alt="" aria-hidden="true" />
              <div className="report-modal__content">
                <h2 className="report-modal__title">What&apos;s Problem?</h2>
                <p className="report-modal__description">
                  Please write down the reason why you think it is incorrect information.
                </p>
              </div>

              <input
                className="report-modal__field"
                type="text"
                aria-label="Leave a comment"
                placeholder="Leave a comment..."
                value={reportComment}
                onChange={(event) => setReportComment(event.target.value)}
              />

              <button type="button" className="report-modal__confirm" onClick={closeReportModal}>
                Confirm
              </button>
            </div>
          </div>
        )}

        {isAddToListOpen && (
          <div className="add-list-sheet" role="presentation" onPointerDown={closeAddToList}>
            <div
              className="add-list-sheet__panel"
              role="dialog"
              aria-modal="true"
              aria-label="Add to list"
              onPointerDown={(event) => event.stopPropagation()}
            >
              <header className="add-list-sheet__header">
                <h2 className="page-title">Add to list</h2>
                <button type="button" className="add-list-sheet__close" aria-label="Close" onClick={closeAddToList}>
                  <img src={closeIcon} alt="" aria-hidden="true" />
                </button>
              </header>

              <div className="add-list-sheet__list" role="list" aria-label="Saved lists">
                {savedLists.map((listItem) => {
                  const isSelected = selectedListId === listItem.id

                  return (
                    <button
                      key={listItem.id}
                      type="button"
                      className={`add-list-sheet__item ${isSelected ? 'is-selected' : ''}`}
                      aria-pressed={isSelected}
                      onClick={() => confirmAddToList(listItem.id, listItem.title)}
                    >
                      <span className="add-list-sheet__thumb">
                        <img src={albumCover} alt="" aria-hidden="true" />
                        <span className="add-list-sheet__thumb-overlay" aria-hidden="true" />
                        <span className="add-list-sheet__check" aria-hidden="true">
                          <img src={checkActiveIcon} alt="" aria-hidden="true" />
                        </span>
                      </span>
                      <span className="add-list-sheet__title">{listItem.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {savedListToast && (
          <button
            type="button"
            className={`saved-list-toast saved-list-toast--${savedListToast.phase}`}
            onClick={closeSavedListToast}
            aria-label="Open saved list"
          >
            <span className="saved-list-toast__thumb">
              <img src={albumCover} alt="" aria-hidden="true" />
            </span>
            <span className="saved-list-toast__copy">
              <span className="saved-list-toast__eyebrow">1 item added</span>
              <span className="saved-list-toast__title">{savedListToast.title}</span>
            </span>
            <img src={rightArrowIcon} alt="" aria-hidden="true" className="saved-list-toast__arrow" />
          </button>
        )}
    </div>
  )
}

export default App
