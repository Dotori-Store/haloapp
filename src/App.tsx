import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from 'react'
import mapBackground from './assets/images/map-backgound.png'
import foodIcon from './assets/icons/ico-cat-food.svg'
import cafeIcon from './assets/icons/ico-cat-cafe.svg'
import prayerIcon from './assets/icons/ico-cat-prayer.svg'
import myLocationIcon from './assets/icons/ico-my-location.svg'
import keepIcon from './assets/icons/ico-keep.svg'
import keepActiveIcon from './assets/icons/ico-keep-active.svg'
import glassIcon from './assets/icons/ico-glass-gray.svg'
import handLikeIcon from './assets/icons/ico-hand-like.svg'
import searchBackIcon from './assets/icons/ico-search-back.svg'
import unhappyIcon from './assets/icons/ico-unhappy.svg'
import { BottomNav } from './components/BottomNav'
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

function App() {
  const [activeFilter, setActiveFilter] = useState<Category>('all')
  const [sheetMode, setSheetMode] = useState<SheetMode>('collapsed')
  const [searchQuery, setSearchQuery] = useState('')
  const [keptPlaceIds, setKeptPlaceIds] = useState<string[]>([])
  const [keptSearchResultIds, setKeptSearchResultIds] = useState<string[]>([])
  const [wishedPlaceIds, setWishedPlaceIds] = useState<string[]>([])
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [isDetailExpanded, setIsDetailExpanded] = useState(false)
  const dragStartY = useRef<number | null>(null)
  const dragPointerId = useRef<number | null>(null)
  const didDragSheet = useRef(false)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

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
  const sheetHeight = isDetail ? '480px' : sheetMode === 'collapsed' ? '168px' : '450px'
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
    setSelectedPlaceId(null)
    setIsDetailExpanded(false)
    setSheetMode((currentMode) => (currentMode === 'collapsed' ? 'expanded' : 'search'))
  }

  const closeSearch = () => {
    setSearchQuery('')
    setSelectedPlaceId(null)
    setIsDetailExpanded(false)
    setSheetMode('collapsed')
  }

  const openPlaceDetail = (placeId: string) => {
    setSelectedPlaceId(placeId)
    setIsDetailExpanded(false)
    setSheetMode('expanded')
  }

  const closePlaceDetail = () => {
    setSelectedPlaceId(null)
    setIsDetailExpanded(false)
    setSheetMode('expanded')
  }

  const toggleKeptPlace = (placeId: string) => {
    setKeptPlaceIds((currentIds) =>
      currentIds.includes(placeId) ? currentIds.filter((id) => id !== placeId) : [...currentIds, placeId],
    )
  }

  const toggleWishedPlace = (placeId: string) => {
    setWishedPlaceIds((currentIds) =>
      currentIds.includes(placeId) ? currentIds.filter((id) => id !== placeId) : [...currentIds, placeId],
    )
  }

  const handlePlaceClick = (place: NearbyPlace) => {
    if (place.id === 'nearby-1') {
      openPlaceDetail(place.id)
    }
  }

  const handleKeepClick = (event: MouseEvent<HTMLButtonElement>, placeId: string) => {
    event.stopPropagation()
    toggleKeptPlace(placeId)
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
      className={`nearby-item__keep ${keptPlaceIds.includes(place.id) ? 'is-active' : ''}`}
      aria-label={`${keptPlaceIds.includes(place.id) ? 'Unkeep' : 'Keep'} ${place.name}`}
      aria-pressed={keptPlaceIds.includes(place.id)}
      onClick={(event) => handleKeepClick(event, place.id)}
    >
      <img src={keptPlaceIds.includes(place.id) ? keepActiveIcon : keepIcon} alt="" aria-hidden="true" />
    </button>
  )

  const renderSearchResultItem = (place: NearbyPlace) => (
    <article className="nearby-item" key={place.id}>
      <span className="nearby-item__icon">
        <img src={foodIcon} alt="" aria-hidden="true" />
      </span>
      <div className="nearby-item__content">
        <h3>{place.name}</h3>
        <p>
          <span className={place.status === 'Open' ? 'is-open' : 'is-closed'}>{place.status}</span>
          {' · '}
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
      className={`nearby-item ${place.id === 'nearby-1' ? 'is-clickable' : ''}`}
      key={place.id}
      role={place.id === 'nearby-1' ? 'button' : undefined}
      tabIndex={place.id === 'nearby-1' ? 0 : undefined}
      onClick={() => handlePlaceClick(place)}
      onKeyDown={(event) => {
        if (place.id === 'nearby-1' && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          openPlaceDetail(place.id)
        }
      }}
    >
      <span className="nearby-item__icon">
        <img src={foodIcon} alt="" aria-hidden="true" />
      </span>
      <div className="nearby-item__content">
        <h3>{place.name}</h3>
        <p>
          <span className={place.status === 'Open' ? 'is-open' : 'is-closed'}>{place.status}</span>
          {' · '}
          {place.address}
        </p>
      </div>
      {renderKeepButton(place)}
    </article>
  )

  return (
    <div className="map-shell">
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
                isKept={keptPlaceIds.includes(selectedPlace.id)}
                isWished={wishedPlaceIds.includes(selectedPlace.id)}
                isExpanded={isDetailExpanded}
                onClose={closePlaceDetail}
                onToggleKeep={() => toggleKeptPlace(selectedPlace.id)}
                onToggleWish={() => toggleWishedPlace(selectedPlace.id)}
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
                    <h2>{copy.nearbyTitle}</h2>
                    <div className="nearby-list">{nearbyPlaces.slice(0, 4).map(renderNearbyItem)}</div>
                  </section>
                )}
              </>
            )}
          </div>
        </div>
        <BottomNav />
      </section>
    </div>
  )
}

export default App










