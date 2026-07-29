import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import backArrowIcon from '../assets/icons/ico-back-arrow.svg'
import shareIcon from '../assets/icons/ico-context-share.svg'
import shareIconLg from '../assets/icons/ico-share-lg.svg'
import moreDotsIcon from '../assets/icons/ico-more-dots.svg'
import moreDotsIconLg from '../assets/icons/ico-more-dots-lg.svg'
import importListIcon from '../assets/icons/ico-import-list.svg'
import headerImportIcon from '../assets/icons/ico-context-import.svg'
import reportIcon from '../assets/icons/ico-context-report.svg'
import mapIcon from '../assets/icons/ico-nav-map.svg'
import wishHeartIcon from '../assets/icons/ico-wish-heart.svg'
import wishHeartActiveIcon from '../assets/icons/ico-wish-heart-active.svg'
import rightArrowIcon from '../assets/icons/ico-right-arrow.svg'
import foodIcon from '../assets/icons/ico-cat-food.svg'
import albumCoverLikeImage from '../assets/images/album-cover-like.png'
import { LovedListImportSheet } from './LovedListImportSheet'
import { RestaurantContextMenu } from './RestaurantContextMenu'
import { useTranslation } from 'react-i18next'
import './ExplorePage.css'
import './LovedListDetailPage.css'

type LovedListRestaurantCategory = 'Cafe' | 'Restaurant'

export type LovedListItem = {
  id: string
  title: string
  owner: string
  date: string
  count: number
  image: string
}

type LovedListDetailPageProps = {
  listItem: LovedListItem
  onBack: () => void
  onAddToList: () => void
  onReportIncorrect: () => void
  onViewOnMap?: (listItem: LovedListItem) => void
}

type LovedListRestaurant = {
  id: string
  name: string
  category: LovedListRestaurantCategory
  address: string
  icon: string
}

type SavedListToast = {
  title: string
  count: number
  image: string
  phase: 'enter' | 'visible' | 'exit'
}

const restaurants: LovedListRestaurant[] = [
  {
    id: 'loved-restaurant-1',
    name: '온달 한식당',
    category: 'Restaurant',
    address: '수원시 장안구 서부로 2129-1, 1층 107호',
    icon: foodIcon,
  },
  {
    id: 'loved-restaurant-2',
    name: '다정한 식당',
    category: 'Restaurant',
    address: '수원시 장안구 서부로 2129-1, 1층 107호',
    icon: foodIcon,
  },
]

const getIconBackground = (category: LovedListRestaurantCategory) =>
  category === 'Cafe' ? 'var(--color-point-cafe)' : 'var(--color-point-restaurant)'

export function LovedListDetailPage({ listItem, onBack, onAddToList, onReportIncorrect, onViewOnMap }: LovedListDetailPageProps) {
  const { t } = useTranslation()
  const [isWishActive, setIsWishActive] = useState(false)
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  const [openRestaurantMenuId, setOpenRestaurantMenuId] = useState<string | null>(null)
  const [isImportSheetOpen, setIsImportSheetOpen] = useState(false)
  const [savedListToast, setSavedListToast] = useState<SavedListToast | null>(null)
  const toastTimerRef = useRef<number | null>(null)
  const toastExitTimerRef = useRef<number | null>(null)

  const openRestaurantMenuItem = useMemo(
    () => restaurants.find((item) => item.id === openRestaurantMenuId) ?? null,
    [openRestaurantMenuId],
  )

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
      }, 140)
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
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current)
      }
      if (toastExitTimerRef.current !== null) {
        window.clearTimeout(toastExitTimerRef.current)
      }
    }
  }, [])

  const openImportSheet = () => {
    setIsHeaderMenuOpen(false)
    setOpenRestaurantMenuId(null)
    setIsImportSheetOpen(true)
  }

  const closeToast = () => {
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

  const handleImportComplete = (payload: { count: number; title: string; image: string }) => {
    setSavedListToast({
      title: payload.title,
      count: payload.count,
      image: payload.image,
      phase: 'enter',
    })
  }

  return (
    <div className="loved-list-detail-page popular-restaurant-page">
      <header className="loved-list-detail-page__header screen-header">
        <div className="screen-header__slot">
          <button type="button" className="screen-header__button" aria-label={t('shared.back')} onClick={onBack}>
            <img src={backArrowIcon} alt="" aria-hidden="true" />
          </button>
        </div>

        <div className="screen-header__actions">
          <button type="button" className="screen-header__button" aria-label={t('shared.share')}>
            <img src={shareIconLg} alt="" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="screen-header__button"
            aria-label={t('shared.moreOptions')}
            aria-expanded={isHeaderMenuOpen}
            onClick={() => {
              setOpenRestaurantMenuId(null)
              setIsHeaderMenuOpen((current) => !current)
            }}
          >
            <img src={moreDotsIconLg} alt="" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="popular-restaurant-page__content loved-list-detail-page__content">
        <section className="loved-list-detail-page__hero" aria-label={listItem.title}>
          <img className="loved-list-detail-page__cover" src={albumCoverLikeImage} alt="" aria-hidden="true" />
          <div className="loved-list-detail-page__title-block">
            <h1 className="loved-list-detail-page__title">{listItem.title}</h1>
            <p className="loved-list-detail-page__owner">{listItem.owner}</p>
            <p className="loved-list-detail-page__date">{listItem.date}</p>
          </div>

          <div className="loved-list-detail-page__actions">
            <button
              type="button"
              className="loved-list-detail-page__wish"
              aria-label={`${isWishActive ? t('placeDetail.unlike') : t('placeDetail.like')} ${listItem.title}`}
              aria-pressed={isWishActive}
              onClick={() => setIsWishActive((current) => !current)}
            >
              <img src={isWishActive ? wishHeartActiveIcon : wishHeartIcon} alt="" aria-hidden="true" />
            </button>

            <button type="button" className="loved-list-detail-page__view-map" onClick={() => onViewOnMap?.(listItem)}>
              <img src={mapIcon} alt="" aria-hidden="true" />
              <span>{t('shared.viewOnMap')}</span>
            </button>

            <button
              type="button"
              className="loved-list-detail-page__import"
              aria-label={t('list.getList')}
              onClick={openImportSheet}
            >
              <img src={importListIcon} alt="" aria-hidden="true" />
            </button>
          </div>
        </section>

        <section className="loved-list-detail-page__restaurants" aria-label={t('listDetail.restaurants')}>
          <div className="explore-popular loved-list-detail-page__restaurant-list">
            {restaurants.map((item) => (
              <article className="explore-popular-item loved-list-detail-page__restaurant-item" key={item.id}>
                <span
                  className="explore-popular-item__icon"
                  style={{ '--place-icon-bg': getIconBackground(item.category) } as CSSProperties}
                >
                  <img src={item.icon} alt="" aria-hidden="true" />
                </span>
                <div className="explore-popular-item__content">
                  <h3>{item.name}</h3>
                  <p>
                    <span>{item.category === 'Cafe' ? t('map.filters.cafe') : t('map.filters.food')}</span>
                    <span className="text-dot" aria-hidden="true" />
                    {item.address}
                  </p>
                </div>
                <button
                  type="button"
                  className="explore-popular-item__more"
                  aria-label={t('listDetail.moreActionsFor', { name: item.name })}
                  aria-expanded={openRestaurantMenuId === item.id}
                  onClick={(event) => {
                    event.stopPropagation()
                    setIsHeaderMenuOpen(false)
                    setOpenRestaurantMenuId((currentId) => (currentId === item.id ? null : item.id))
                  }}
                >
                  <img src={moreDotsIcon} alt="" aria-hidden="true" />
                </button>

                {openRestaurantMenuId === item.id && (
                  <RestaurantContextMenu
                    itemName={item.name}
                    onAdd={() => {
                      setOpenRestaurantMenuId(null)
                      onAddToList()
                    }}
                    onReport={() => {
                      setOpenRestaurantMenuId(null)
                      onReportIncorrect()
                    }}
                  />
                )}
              </article>
            ))}
          </div>
        </section>
      </div>

      {isHeaderMenuOpen && (
        <>
          <button
            type="button"
            className="loved-list-detail-page__header-menu-backdrop"
            aria-label={t('list.closeListMenu')}
            onClick={() => setIsHeaderMenuOpen(false)}
          />

          <div className="loved-list-detail-page__header-menu" role="menu" aria-label={t('listDetail.listOptions', { title: listItem.title })}>
            <button
              type="button"
              className="loved-list-detail-page__header-menu-item"
              role="menuitem"
              onClick={openImportSheet}
            >
              <span className="loved-list-detail-page__header-menu-icon" aria-hidden="true">
                <img src={headerImportIcon} alt="" aria-hidden="true" />
              </span>
              <span>{t('list.getList')}</span>
            </button>
            <button
              type="button"
              className="loved-list-detail-page__header-menu-item loved-list-detail-page__header-menu-item--danger"
              role="menuitem"
              onClick={() => {
                setIsHeaderMenuOpen(false)
                onReportIncorrect()
              }}
            >
              <span className="loved-list-detail-page__header-menu-icon" aria-hidden="true">
                <img src={reportIcon} alt="" aria-hidden="true" />
              </span>
              <span>{t('shared.report')}</span>
            </button>
          </div>
        </>
      )}

      {openRestaurantMenuItem && (
        <button
          type="button"
          className="explore-popular-item__backdrop"
          aria-label={t('listDetail.closeActionsFor', { name: openRestaurantMenuItem.name })}
          onClick={() => setOpenRestaurantMenuId(null)}
        />
      )}

      <LovedListImportSheet
        open={isImportSheetOpen}
        onClose={() => setIsImportSheetOpen(false)}
        onComplete={handleImportComplete}
      />

      {savedListToast && (
        <button
          type="button"
          className={`saved-list-toast saved-list-toast--${savedListToast.phase}`}
          onClick={closeToast}
          aria-label={t('shared.openSavedList')}
        >
          <span className="saved-list-toast__thumb">
            <img src={savedListToast.image} alt="" aria-hidden="true" />
          </span>
          <span className="saved-list-toast__copy">
            <span className="saved-list-toast__eyebrow">{t('list.itemAdded', { count: savedListToast.count })}</span>
            <span className="saved-list-toast__title">{savedListToast.title}</span>
          </span>
          <img src={rightArrowIcon} alt="" aria-hidden="true" className="saved-list-toast__arrow" />
        </button>
      )}
    </div>
  )
}
