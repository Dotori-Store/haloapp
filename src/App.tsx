import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import mapBackground from './assets/images/map-backgound.png'
import foodIcon from './assets/icons/ico-cat-food.svg'
import cafeIcon from './assets/icons/ico-cat-cafe.svg'
import prayerIcon from './assets/icons/ico-cat-prayer.svg'
import myLocationIcon from './assets/icons/ico-my-location.svg'
import addPlusIcon from './assets/icons/ico-add-plus-xs.svg'
import glassIcon from './assets/icons/ico-glass-gray.svg'
import handLikeIcon from './assets/icons/ico-hand-like.svg'
import searchBackIcon from './assets/icons/ico-search-back.svg'
import unhappyIcon from './assets/icons/ico-unhappy.svg'
import { BottomNav } from './components/BottomNav'
import { nearbyPlaces } from './data/places'
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
  const dragStartY = useRef<number | null>(null)
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

  const sheetHeight = sheetMode === 'expanded' ? '450px' : '168px'
  const stageStyle = { '--map-sheet-height': sheetHeight } as CSSProperties

  const canDragSheet = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
      return false
    }

    return !target.closest('.map-search, .nearby-places, .search-results, .recommend-button, button')
  }

  const startSheetDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!canDragSheet(event.target)) {
      return
    }

    dragStartY.current = event.clientY
  }

  const finishSheetDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) {
      return
    }

    const dragDistance = dragStartY.current - event.clientY
    if (dragDistance > 40 && sheetMode !== 'search') {
      setSheetMode('expanded')
    }

    if (dragDistance < -40) {
      setSheetMode('collapsed')
    }

    dragStartY.current = null
  }

  const openSearch = () => {
    setSheetMode('search')
  }

  const closeSearch = () => {
    setSearchQuery('')
    setSheetMode('collapsed')
  }

  const isExpanded = sheetMode === 'expanded'
  const isSearch = sheetMode === 'search'
  const hasSearchQuery = searchQuery.trim().length > 0

  return (
    <div className="map-shell">
      <section className={`map-stage ${isSearch ? 'is-searching' : ''}`} aria-label={copy.title} style={stageStyle}>
        <div className="map-background" style={{ backgroundImage: `url(${mapBackground})` }}>
          <div className="map-overlay" />

          {visiblePlaces.map((place) => (
            <button
              key={place.id}
              type="button"
              className={`map-marker map-marker-${place.category}`}
              style={{ left: `${place.x}%`, top: `${place.y}%` }}
              aria-label={place.name}
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
          className={`map-sheet ${isSearch ? 'is-searching' : ''}`}
          onPointerDown={startSheetDrag}
          onPointerUp={finishSheetDrag}
          onPointerCancel={() => {
            dragStartY.current = null
          }}
        >
          <div className="map-handle" aria-hidden="true" />
          <div className="map-sheet-body">
            {isSearch ? (
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
                    <div className="nearby-list nearby-list--search">
                    {nearbyPlaces.map((place) => (
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
                        <button type="button" className="nearby-item__add" aria-label={`Add ${place.name}`}>
                          <img src={addPlusIcon} alt="" aria-hidden="true" />
                        </button>
                      </article>
                    ))}
                    </div>
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
                <button type="button" className="map-search" onClick={openSearch}>
                  <img src={glassIcon} alt="" aria-hidden="true" />
                  <span>{copy.searchPlaceholder}</span>
                </button>
                {isExpanded && (
                  <section className="nearby-places" aria-label={copy.nearbyTitle}>
                    <h2>{copy.nearbyTitle}</h2>
                    <div className="nearby-list">
                      {nearbyPlaces.slice(0, 4).map((place) => (
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
                          <button type="button" className="nearby-item__add" aria-label={`Add ${place.name}`}>
                            <img src={addPlusIcon} alt="" aria-hidden="true" />
                          </button>
                        </article>
                      ))}
                    </div>
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
