import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from 'react'
import mapBackground from './assets/images/map-backgound.png'
import foodIcon from './assets/icons/ico-cat-food.svg'
import cafeIcon from './assets/icons/ico-cat-cafe.svg'
import prayerIcon from './assets/icons/ico-cat-prayer.svg'
import myLocationIcon from './assets/icons/ico-my-location.svg'
import keepIcon from './assets/icons/ico-keep.svg'
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
import { useTranslation } from 'react-i18next'
import { BottomNav, type BottomNavTab } from './components/BottomNav'
import { ExplorePage } from './components/ExplorePage'
import { ListPage } from './components/ListPage'
import { OnboardingScreen } from './components/OnboardingScreen'
import { SplashScreen } from './components/SplashScreen'
import { RestaurantAddPage } from './components/RestaurantAddPage'
import { MyPage } from './components/MyPage'
import { PlaceDetailSheet } from './components/PlaceDetailSheet'
import { type LovedListItem } from './components/LovedListDetailPage'
import {
  getLocalizedPlaceAddress,
  getLocalizedPlaceName,
  listMapPlaces,
  mapPlaces as appMapPlaces,
  nearbyPlacesData as nearbyPlaces,
  searchResultPlacesData as searchResultPlaces,
  type ListMapPlace,
  type NearbyPlace,
} from './data/mapPlaces'
import './App.css'
import './components/MapSheet.css'

type Category = 'all' | 'food' | 'cafe' | 'prayer'
type SheetMode = 'collapsed' | 'expanded' | 'search'
type ListMapMode = 'summary' | 'expanded' | 'search'
type ListMapReturnTarget = 'list' | 'explore' | 'my'

const DRAG_START_THRESHOLD = 24
const SHEET_SNAP_THRESHOLD = 140

const savedLists = [
  { id: 'list-1', title: 'Rainy Day Cafe' },
  { id: 'list-2', title: 'Drive' },
  { id: 'list-3', title: 'Spring Day' },
  { id: 'list-4', title: 'Rose' },
]

const getPlaceIconBackground = () => 'var(--color-point-restaurant)'

function App() {
  const { t, i18n } = useTranslation()
  const [isSplashVisible, setIsSplashVisible] = useState(true)
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(true)
  const [activeTab, setActiveTab] = useState<BottomNavTab>('map')
  const [activeFilter, setActiveFilter] = useState<Category>('all')
  const [sheetMode, setSheetMode] = useState<SheetMode>('collapsed')
  const [listMapMode, setListMapMode] = useState<ListMapMode>('summary')
  const [listMapItem, setListMapItem] = useState<LovedListItem | null>(null)
  const [isListMapSummaryVisible, setIsListMapSummaryVisible] = useState(true)
  const [listMapSearchQuery, setListMapSearchQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [wishedPlaceIds, setWishedPlaceIds] = useState<string[]>([])
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [isDetailExpanded, setIsDetailExpanded] = useState(false)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [isAddToListOpen, setIsAddToListOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isRestaurantAddOpen, setIsRestaurantAddOpen] = useState(false)
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true)
  const [restaurantAddReturnListId, setRestaurantAddReturnListId] = useState<string | null>(null)
  const [pendingListDetailId, setPendingListDetailId] = useState<string | null>(null)
  const [listMapReturnTarget, setListMapReturnTarget] = useState<ListMapReturnTarget>('list')
  const [pendingExploreListDetail, setPendingExploreListDetail] = useState<LovedListItem | null>(null)
  const [pendingMyListDetail, setPendingMyListDetail] = useState<LovedListItem | null>(null)
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

  const copy = {
    title: t('map.title'),
    myLocation: t('map.myLocation'),
    filterLabel: t('map.filterLabel'),
    filters: {
      all: t('map.filters.all'),
      food: t('map.filters.food'),
      cafe: t('map.filters.cafe'),
      prayer: t('map.filters.prayer'),
    },
    searchPlaceholder: t('map.searchPlaceholder'),
    nearbyTitle: t('map.nearbyTitle'),
    recommend: t('map.recommend'),
  }
  const getPlaceName = (place: NearbyPlace | ListMapPlace | (typeof appMapPlaces)[number]) =>
    getLocalizedPlaceName(i18n.language, place)
  const getPlaceAddress = (place: NearbyPlace | ListMapPlace) => getLocalizedPlaceAddress(i18n.language, place)

  useEffect(() => {
    document.documentElement.lang = i18n.language.startsWith('ko') ? 'ko' : 'en'
  }, [i18n.language])

  useEffect(() => {
    const splashTimer = window.setTimeout(() => {
      setIsSplashVisible(false)
    }, 1400)

    return () => {
      window.clearTimeout(splashTimer)
    }
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
    if (listMapMode !== 'search') {
      return
    }

    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
  }, [listMapMode])

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
    const visibleMapPlaces = listMapItem ? listMapPlaces : appMapPlaces

    if (activeFilter === 'all') {
      return visibleMapPlaces
    }

    return visibleMapPlaces.filter((place) => place.category === activeFilter)
  }, [activeFilter, listMapItem])

  const visibleListMapPlaces = useMemo(() => {
    const filteredPlaces =
      activeFilter === 'all' ? listMapPlaces : listMapPlaces.filter((place) => place.category === activeFilter)

    return listMapSearchQuery.trim() ? filteredPlaces.slice(0, 2) : filteredPlaces
  }, [activeFilter, listMapSearchQuery])

  const selectedPlace = nearbyPlaces.find((place) => place.id === selectedPlaceId) ?? null
  const isDetail = selectedPlace !== null
  const isListMap = listMapItem !== null
  const isListMapPanelOpen = isListMap && !isDetail && listMapMode !== 'summary'
  const isExpanded = sheetMode === 'expanded'
  const isSearch = sheetMode === 'search' && !isDetail && !isListMapPanelOpen
  const hasSearchQuery = searchQuery.trim().length > 0
  const detailSheetHeight = selectedPlace?.photoUrl ? '480px' : '430px'
  const sheetHeight = isDetail
    ? detailSheetHeight
    : isListMap && !isListMapPanelOpen
      ? '0px'
      : isListMapPanelOpen
        ? '450px'
        : sheetMode === 'collapsed'
          ? '168px'
          : '450px'
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
      ? event.target.closest('.map-search, .nearby-item, .place-detail, .list-map-sheet, .list-map-summary, button, input')
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

    if (isListMap) {
      if (dragDistance > SHEET_SNAP_THRESHOLD && listMapMode === 'summary') {
        setListMapMode('expanded')
      }

      if (dragDistance > SHEET_SNAP_THRESHOLD && listMapMode === 'expanded') {
        setListMapMode('search')
      }

      if (dragDistance < -SHEET_SNAP_THRESHOLD && listMapMode === 'search') {
        setListMapMode('expanded')
      }

      if (dragDistance < -SHEET_SNAP_THRESHOLD && listMapMode === 'expanded') {
        setIsListMapSummaryVisible(true)
        setListMapMode('summary')
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
    if (listMapItem) {
      setSelectedPlaceId(null)
      setIsDetailExpanded(false)
      setListMapMode('search')
      window.requestAnimationFrame(() => {
        searchInputRef.current?.focus()
      })
      return
    }

    setActiveTab('map')
    setSelectedPlaceId(null)
    setIsDetailExpanded(false)
    setIsPhotoModalOpen(false)
    setIsAddToListOpen(false)
    setSheetMode((currentMode) => (currentMode === 'collapsed' ? 'expanded' : 'search'))
  }

  const closeSearch = () => {
    if (listMapItem) {
      setListMapSearchQuery('')
      setSelectedPlaceId(null)
      setIsDetailExpanded(false)
      setListMapMode('expanded')
      return
    }

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
    if (!listMapItem) {
      setSheetMode('expanded')
    }
  }

  const closePlaceDetail = () => {
    setSelectedPlaceId(null)
    setIsDetailExpanded(false)
    setIsPhotoModalOpen(false)
    setIsAddToListOpen(false)
    setIsReportModalOpen(false)
    if (listMapItem) {
      setActiveTab('map')
      return
    }

    setActiveTab('map')
    setSheetMode('collapsed')
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

  const openRestaurantAddPage = (returnListId: string | null = null) => {
    setIsPhotoModalOpen(false)
    setIsAddToListOpen(false)
    setIsReportModalOpen(false)
    setSavedListToast(null)
    setRestaurantAddReturnListId(returnListId)
    setIsBottomNavVisible(false)
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
    if (restaurantAddReturnListId) {
      setActiveTab('list')
      setPendingListDetailId(restaurantAddReturnListId)
      setIsBottomNavVisible(false)
      return
    }

    setIsBottomNavVisible(true)
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

  const getMapPlaceIcon = (category: Exclude<Category, 'all'>) => {
    if (category === 'cafe') {
      return cafeIcon
    }

    if (category === 'prayer') {
      return prayerIcon
    }

    return foodIcon
  }

  const getMapPlaceIconClass = (category: Exclude<Category, 'all'>) => {
    if (category === 'cafe') {
      return 'map-marker-cafe'
    }

    if (category === 'prayer') {
      return 'map-marker-prayer'
    }

    return 'map-marker-food'
  }

  const getListMapDetailPlaceId = (place: ListMapPlace) => {
    if (place.detailType === 1) {
      return 'nearby-1'
    }

    if (place.detailType === 3) {
      return 'nearby-3'
    }

    return 'nearby-2'
  }

  const openListOnMap = (listItem: LovedListItem, returnTarget: ListMapReturnTarget = 'list') => {
    setActiveTab('map')
    setListMapItem(listItem)
    setListMapReturnTarget(returnTarget)
    setIsListMapSummaryVisible(true)
    setListMapMode('summary')
    setListMapSearchQuery('')
    setSheetMode('collapsed')
    setSelectedPlaceId(null)
    setIsDetailExpanded(false)
    setIsPhotoModalOpen(false)
    setIsAddToListOpen(false)
    setIsReportModalOpen(false)
    setSearchQuery('')
    setIsBottomNavVisible(true)
  }

  const closeListOnMap = () => {
    const currentListMapItem = listMapItem
    setListMapItem(null)
    setIsListMapSummaryVisible(true)
    setListMapMode('summary')
    setListMapSearchQuery('')
    setSelectedPlaceId(null)
    setIsDetailExpanded(false)

    if (listMapReturnTarget === 'explore' && currentListMapItem) {
      setActiveTab('explore')
      setPendingExploreListDetail(currentListMapItem)
      setIsBottomNavVisible(false)
      return
    }

    if (listMapReturnTarget === 'my' && currentListMapItem) {
      setActiveTab('my')
      setPendingMyListDetail(currentListMapItem)
      setIsBottomNavVisible(false)
      return
    }

    setActiveTab('list')
    if (currentListMapItem) {
      setPendingListDetailId(currentListMapItem.id)
      setIsBottomNavVisible(false)
    }
  }

  const collapseListMapNav = () => {
    setListMapItem(null)
    setIsListMapSummaryVisible(true)
    setListMapMode('summary')
    setListMapSearchQuery('')
    setSelectedPlaceId(null)
    setIsDetailExpanded(false)
    setActiveTab('map')
    setSheetMode('collapsed')
    setIsBottomNavVisible(true)
  }

  const handlePlaceClick = (place: NearbyPlace) => {
    if (place.id === 'nearby-1' || place.id === 'nearby-2' || place.id === 'nearby-3') {
      openPlaceDetail(place.id)
    }
  }

  const renderKeepButton = (place: NearbyPlace) => (
    <button
      type="button"
      className="nearby-item__keep"
      aria-label={t('listDetail.addToList', { name: getPlaceName(place) })}
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
        <h3>{getPlaceName(place)}</h3>
        <p>
          <span className={place.status === 'Open' ? 'is-open' : 'is-closed'}>{place.status === 'Open' ? t('map.openStatus') : t('map.closedStatus')}</span>
          <span className="text-dot" aria-hidden="true" />
          {getPlaceAddress(place)}
        </p>
      </div>
      <button
        type="button"
        className="nearby-item__keep"
        aria-label={t('listDetail.addToList', { name: getPlaceName(place) })}
        aria-haspopup="dialog"
        onClick={(event) => {
          event.stopPropagation()
          openListSheet()
        }}
      >
        <img src={keepIcon} alt="" aria-hidden="true" />
      </button>
    </article>
  )

  const renderListMapPlaceItem = (place: ListMapPlace) => (
    <article
      className="nearby-item list-map-place-item is-clickable"
      key={place.id}
      role="button"
      tabIndex={0}
      onClick={() => openPlaceDetail(getListMapDetailPlaceId(place))}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openPlaceDetail(getListMapDetailPlaceId(place))
        }
      }}
    >
      <span
        className="nearby-item__icon"
        style={
          {
            '--place-icon-bg':
              place.category === 'cafe'
                ? 'var(--color-point-cafe)'
                : place.category === 'prayer'
                  ? 'var(--color-point-prayer)'
                  : 'var(--color-point-restaurant)',
          } as CSSProperties
        }
      >
        <img src={getMapPlaceIcon(place.category)} alt="" aria-hidden="true" />
      </span>
      <div className="nearby-item__content">
        <h3>{getPlaceName(place)}</h3>
        <p>
          <span className={place.status === 'Open' ? 'is-open' : 'is-closed'}>{place.status === 'Open' ? t('map.openStatus') : t('map.closedStatus')}</span>
          <span className="text-dot" aria-hidden="true" />
          {getPlaceAddress(place)}
        </p>
      </div>
      <span className="list-map-place-item__arrow" aria-hidden="true">
        <img src={rightArrowIcon} alt="" aria-hidden="true" />
      </span>
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
        <h3>{getPlaceName(place)}</h3>
        <p>
          <span className={place.status === 'Open' ? 'is-open' : 'is-closed'}>{place.status === 'Open' ? t('map.openStatus') : t('map.closedStatus')}</span>
          <span className="text-dot" aria-hidden="true" />
          {getPlaceAddress(place)}
        </p>
      </div>
      {renderKeepButton(place)}
    </article>
  )

  const openExplore = () => {
    setActiveTab('explore')
    setListMapItem(null)
    setPendingMyListDetail(null)
    setPendingListDetailId(null)
    setIsListMapSummaryVisible(true)
    setListMapMode('summary')
    setListMapSearchQuery('')
    setSheetMode('collapsed')
    setSelectedPlaceId(null)
    setIsDetailExpanded(false)
    setIsPhotoModalOpen(false)
    setIsAddToListOpen(false)
    setIsReportModalOpen(false)
    setSearchQuery('')
    setIsBottomNavVisible(true)
  }

  const openListTab = () => {
    setActiveTab('list')
    setListMapItem(null)
    setPendingExploreListDetail(null)
    setPendingMyListDetail(null)
    setIsListMapSummaryVisible(true)
    setListMapMode('summary')
    setListMapSearchQuery('')
    setSheetMode('collapsed')
    setSelectedPlaceId(null)
    setIsDetailExpanded(false)
    setIsPhotoModalOpen(false)
    setIsAddToListOpen(false)
    setIsReportModalOpen(false)
    setSearchQuery('')
    setIsBottomNavVisible(true)
  }

  const openMy = () => {
    setActiveTab('my')
    setListMapItem(null)
    setPendingExploreListDetail(null)
    setPendingListDetailId(null)
    setIsListMapSummaryVisible(true)
    setListMapMode('summary')
    setListMapSearchQuery('')
    setSheetMode('collapsed')
    setSelectedPlaceId(null)
    setIsDetailExpanded(false)
    setIsPhotoModalOpen(false)
    setIsAddToListOpen(false)
    setIsReportModalOpen(false)
    setSearchQuery('')
    setIsBottomNavVisible(true)
  }

  const openMap = () => {
    setActiveTab('map')
    setListMapItem(null)
    setPendingExploreListDetail(null)
    setPendingMyListDetail(null)
    setPendingListDetailId(null)
    setIsListMapSummaryVisible(true)
    setListMapMode('summary')
    setListMapSearchQuery('')
    setSheetMode('collapsed')
    setIsBottomNavVisible(true)
  }

  const handleBottomNavChange = (tab: BottomNavTab) => {
    setIsRestaurantAddOpen(false)

    if (listMapItem && tab === 'list') {
      collapseListMapNav()
      return
    }

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
      <SplashScreen visible={isSplashVisible} />

      <OnboardingScreen visible={!isSplashVisible && isOnboardingVisible} onFinish={() => setIsOnboardingVisible(false)} />

      {isRestaurantAddOpen ? (
        <RestaurantAddPage onClose={closeRestaurantAddPage} />
      ) : activeTab === 'explore' ? (
        <ExplorePage
          onAddToList={openListSheet}
          onReportIncorrect={openReportModal}
          onViewListOnMap={(listItem) => openListOnMap(listItem, 'explore')}
          onBottomNavVisibilityChange={setIsBottomNavVisible}
          restoreListItem={pendingExploreListDetail}
          onRestoreListItemHandled={() => setPendingExploreListDetail(null)}
        />
      ) : activeTab === 'list' ? (
      <ListPage
          onAddRestaurant={openRestaurantAddPage}
          onAddToList={openListSheet}
          onViewListOnMap={(listItem) => openListOnMap(listItem, 'list')}
          onBottomNavVisibilityChange={setIsBottomNavVisible}
          restoreSelectedListId={pendingListDetailId}
          onRestoreSelectedListIdHandled={() => setPendingListDetailId(null)}
        />
      ) : activeTab === 'my' ? (
        <MyPage
          onReportIncorrect={openReportModal}
          onAddToList={openListSheet}
          onViewListOnMap={(listItem) => openListOnMap(listItem, 'my')}
          onBottomNavVisibilityChange={setIsBottomNavVisible}
          restoreListItem={pendingMyListDetail}
          onRestoreListItemHandled={() => setPendingMyListDetail(null)}
        />
      ) : (
        <section
          className={`map-stage ${isSearch ? 'is-searching' : ''} ${isDetail ? 'is-detail' : ''} ${isListMap ? 'is-list-map' : ''} ${isListMapPanelOpen ? 'is-list-map-panel-open' : ''} ${listMapMode === 'search' ? 'is-list-map-searching' : ''}`}
          aria-label={copy.title}
          style={stageStyle}
        >
          <div className="map-background" style={{ backgroundImage: `url(${mapBackground})` }}>
            <div className="map-overlay" />

            {visiblePlaces.map((place) => (
              <button
                key={place.id}
                type="button"
                className={`map-marker ${getMapPlaceIconClass(place.category)}`}
                style={{ left: `${place.x}%`, top: `${place.y}%` }}
                aria-label={getPlaceName(place)}
                onClick={() =>
                  openPlaceDetail('detailPlaceId' in place ? place.detailPlaceId : getListMapDetailPlaceId(place))
                }
              >
                <span className="map-marker-inner">
                  <img src={'icon' in place ? place.icon : getMapPlaceIcon(place.category)} alt="" aria-hidden="true" />
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

          {listMapItem && !isDetail && listMapMode === 'summary' && isListMapSummaryVisible && (
            <article
              className="list-map-summary"
              role="button"
              tabIndex={0}
              onClick={() => {
                setIsListMapSummaryVisible(false)
                setListMapMode('expanded')
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setIsListMapSummaryVisible(false)
                  setListMapMode('expanded')
                }
              }}
            >
              <span className="list-map-summary__thumb">
                <img src={albumCover} alt="" aria-hidden="true" />
                <span className="list-map-summary__count">{listMapItem.count}</span>
              </span>
              <span className="list-map-summary__copy">
                <span className="list-map-summary__title">{listMapItem.title}</span>
                <span className="list-map-summary__owner">{listMapItem.owner}</span>
              </span>
              <button
                type="button"
                className="list-map-summary__close"
                aria-label={t('map.closeListMap')}
                onClick={(event) => {
                  event.stopPropagation()
                  closeListOnMap()
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    event.stopPropagation()
                    closeListOnMap()
                  }
                }}
              >
                <img src={closeIcon} alt="" aria-hidden="true" />
              </button>
            </article>
          )}

          <div
            className={`map-sheet ${isSearch ? 'is-searching' : ''} ${isDetail ? 'is-detail' : ''} ${isDetailExpanded ? 'is-detail-expanded' : ''} ${isListMapPanelOpen ? 'is-list-map-sheet' : ''} ${listMapMode === 'search' ? 'is-list-map-searching' : ''}`}
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
              ) : isListMapPanelOpen && listMapItem ? (
                <section className="list-map-sheet" aria-label={`${listMapItem.title} map list`}>
                  {listMapMode === 'search' ? (
                    <div className="map-search search-field list-map-sheet__search">
                      <img src={glassIcon} alt="" aria-hidden="true" />
                        <input
                          ref={searchInputRef}
                          aria-label={t('map.searchInList', { title: listMapItem.title })}
                          className="search-input"
                          type="search"
                          value={listMapSearchQuery}
                          onChange={(event) => setListMapSearchQuery(event.target.value)}
                        />
                        {listMapSearchQuery && (
                          <button
                            type="button"
                            className="search-clear"
                            aria-label={t('restaurantAdd.clearSearch')}
                            onClick={(event) => {
                              event.stopPropagation()
                              setListMapSearchQuery('')
                            }}
                          >
                            <img src={deleteTextIcon} alt="" aria-hidden="true" />
                          </button>
                        )}
                    </div>
                  ) : (
                    <button type="button" className="map-search list-map-sheet__search" onClick={openSearch}>
                      <img src={glassIcon} alt="" aria-hidden="true" />
                      <span>{copy.searchPlaceholder}</span>
                    </button>
                  )}

                  <div className="list-map-sheet__meta">
                    <p>
                      <span>{listMapItem.title}</span>
                      <span className="text-dot" aria-hidden="true" />
                      <span>{listMapItem.owner}</span>
                    </p>
                    <span>{t('map.placesCount', { count: visibleListMapPlaces.length })}</span>
                  </div>

                  <div className="list-map-sheet__results">
                    <div className="nearby-list list-map-sheet__list">
                      {visibleListMapPlaces.map(renderListMapPlaceItem)}
                    </div>
                  </div>
                </section>
              ) : isSearch ? (
                <>
                  <div className="map-search search-field">
                    <button type="button" className="search-back" aria-label={t('map.closeSearch')} onClick={closeSearch}>
                      <img src={searchBackIcon} alt="" aria-hidden="true" />
                    </button>
                    <input
                      ref={searchInputRef}
                      aria-label={t('map.searchPlaces')}
                      className="search-input"
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="search-clear"
                        aria-label={t('restaurantAdd.clearSearch')}
                        onClick={() => setSearchQuery('')}
                      >
                        <img src={deleteTextIcon} alt="" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  {hasSearchQuery && (
                    <div className="search-results">
                      {searchResultPlaces.length > 0 ? (
                        <div className="nearby-list nearby-list--search">{searchResultPlaces.map(renderSearchResultItem)}</div>
                      ) : (
                        <div className="no-results" role="status">
                          <img src={unhappyIcon} alt="" aria-hidden="true" />
                          <p>{t('map.noResult')}</p>
                        </div>
                      )}
                    </div>
                  )}
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
          {isBottomNavVisible && !isRestaurantAddOpen && (
        <BottomNav
          activeTab={isListMap ? 'list' : activeTab}
          variant={isListMap && !isDetail && listMapMode === 'summary' && isListMapSummaryVisible ? 'compactList' : 'default'}
          onChangeTab={handleBottomNavChange}
          onAdd={() => openRestaurantAddPage()}
        />
      )}

        {isPhotoModalOpen && (
          <div className="photo-modal-backdrop" role="presentation" onMouseDown={closePhotoModal}>
            <div
              className="photo-modal"
              role="dialog"
              aria-modal="true"
              aria-label={t('map.addPhoto')}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button type="button" className="photo-modal__option" aria-label={t('map.photoLibrary')}>
                <img src={cameraIcon} alt="" aria-hidden="true" />
                <span>{t('map.photoLibrary')}</span>
              </button>
              <button type="button" className="photo-modal__option" aria-label={t('map.fileLibrary')}>
                <img src={fileIcon} alt="" aria-hidden="true" />
                <span>{t('map.fileLibrary')}</span>
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
              aria-label={t('map.incorrectInformation')}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button type="button" className="report-modal__close" aria-label={t('shared.close')} onClick={closeReportModal}>
                <img src={closeIcon} alt="" aria-hidden="true" />
              </button>

              <img className="report-modal__icon" src={cautionIcon} alt="" aria-hidden="true" />
              <div className="report-modal__content">
                <h2 className="report-modal__title">{t('map.whatsProblem')}</h2>
                <p className="report-modal__description">{t('map.reportReason')}</p>
              </div>

              <input
                className="report-modal__field"
                type="text"
                aria-label={t('map.leaveComment')}
                placeholder={t('map.leaveComment')}
                value={reportComment}
                onChange={(event) => setReportComment(event.target.value)}
              />

              <button type="button" className="report-modal__confirm" onClick={closeReportModal}>
                {t('shared.confirm')}
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
              aria-label={t('shared.addToList')}
              onPointerDown={(event) => event.stopPropagation()}
            >
              <header className="add-list-sheet__header">
                <h2 className="page-title">{t('shared.addToList')}</h2>
                <button type="button" className="add-list-sheet__close" aria-label={t('shared.close')} onClick={closeAddToList}>
                  <img src={closeIcon} alt="" aria-hidden="true" />
                </button>
              </header>

              <div className="add-list-sheet__list" role="list" aria-label={t('list.savedLists')}>
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
            aria-label={t('shared.openSavedList')}
          >
            <span className="saved-list-toast__thumb">
              <img src={albumCover} alt="" aria-hidden="true" />
            </span>
            <span className="saved-list-toast__copy">
              <span className="saved-list-toast__eyebrow">{t('list.itemAdded', { count: 1 })}</span>
              <span className="saved-list-toast__title">{savedListToast.title}</span>
            </span>
            <img src={rightArrowIcon} alt="" aria-hidden="true" className="saved-list-toast__arrow" />
          </button>
        )}
    </div>
  )
}

export default App
