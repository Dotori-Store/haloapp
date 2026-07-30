import { useMemo, useState, type CSSProperties } from 'react'
import backArrowIcon from '../assets/icons/ico-back-arrow.svg'
import foodIcon from '../assets/icons/ico-cat-food.svg'
import cafeIcon from '../assets/icons/ico-cat-cafe.svg'
import moreDotsIcon from '../assets/icons/ico-more-dots.svg'
import { RestaurantContextMenu } from './RestaurantContextMenu'
import { useTranslation } from 'react-i18next'
import './ExplorePage.css'
import './PopularRestaurantPage.css'

type RestaurantCategory = 'Cafe' | 'Restaurant'

type PopularRestaurantItem = {
  id: string
  name: string
  category: RestaurantCategory
  address: string
  icon: string
}

type PopularRestaurantPageProps = {
  onBack: () => void
  onAddToList: () => void
  onReportIncorrect: () => void
}

const restaurants: PopularRestaurantItem[] = [
  { id: 'popular-1', name: '오지커피', category: 'Cafe', address: '수원시 장안구 서부로 2129-1, 1층 107호', icon: cafeIcon },
  { id: 'popular-2', name: '다정한 식당', category: 'Restaurant', address: '수원시 장안구 서부로 2129-1, 1층 107호', icon: foodIcon },
  { id: 'popular-3', name: '베러데이 커피', category: 'Cafe', address: '수원시 장안구 서부로 2129-1, 1층 107호', icon: cafeIcon },
  { id: 'popular-4', name: '온달 한식당', category: 'Restaurant', address: '수원시 장안구 서부로 2129-1, 1층 107호', icon: foodIcon },
  { id: 'popular-5', name: '제주 한식당', category: 'Restaurant', address: '수원시 장안구 서부로 2129-1, 1층 107호', icon: foodIcon },
  { id: 'popular-6', name: '안동갈비 한식당', category: 'Restaurant', address: '수원시 장안구 서부로 2129-1, 1층 107호', icon: foodIcon },
  { id: 'popular-7', name: '베러데이 커피', category: 'Cafe', address: '수원시 장안구 서부로 2129-1, 1층 107호', icon: cafeIcon },
  { id: 'popular-8', name: '온정 한식당', category: 'Restaurant', address: '수원시 장안구 서부로 2129-1, 1층 107호', icon: foodIcon },
]

const getIconBackground = (category: RestaurantCategory) =>
  category === 'Cafe' ? 'var(--color-point-cafe)' : 'var(--color-point-restaurant)'

export function PopularRestaurantPage({ onBack, onAddToList, onReportIncorrect }: PopularRestaurantPageProps) {
  const { t, i18n } = useTranslation()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const openMenuItem = useMemo(() => restaurants.find((item) => item.id === openMenuId) ?? null, [openMenuId])
  const isKorean = i18n.language.startsWith('ko')

  const getRestaurantName = (item: PopularRestaurantItem) => {
    switch (item.id) {
      case 'popular-1':
        return isKorean ? item.name : 'Oozy Coffee'
      case 'popular-2':
        return isKorean ? item.name : 'Dajunghan Korean Restaurant'
      case 'popular-3':
        return isKorean ? item.name : 'Betterday Coffee'
      case 'popular-4':
        return isKorean ? item.name : 'Ondal Korean Restaurant'
      case 'popular-5':
        return isKorean ? item.name : 'Jisoo Korean Restaurant'
      case 'popular-6':
        return isKorean ? item.name : 'Andong Galbi Korean Restaurant'
      case 'popular-7':
        return isKorean ? item.name : 'Betterday Coffee'
      case 'popular-8':
        return isKorean ? item.name : 'Jeong Korean Restaurant'
      default:
        return item.name
    }
  }

  const getRestaurantAddress = (item: PopularRestaurantItem) => {
    return isKorean ? item.address : '107, 1F, 2129-1, Seobu-ro, Jangan-gu'
  }

  return (
    <div className="popular-restaurant-page">
      <div className="popular-restaurant-page__header screen-header">
        <div className="screen-header__slot">
          <button type="button" className="screen-header__button" aria-label={t('shared.back')} onClick={onBack}>
            <img src={backArrowIcon} alt="" aria-hidden="true" />
          </button>
        </div>
        <div className="screen-header__title">
          <h1 className="head-title">{t('explore.popularRestaurantTitle')}</h1>
        </div>
        <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />
      </div>

      <div className="popular-restaurant-page__content">
        <div className="explore-popular popular-restaurant-page__list">
          {restaurants.map((item) => (
            <article className="explore-popular-item" key={item.id}>
              <span className="explore-popular-item__icon" style={{ '--place-icon-bg': getIconBackground(item.category) } as CSSProperties}>
                <img src={item.icon} alt="" aria-hidden="true" />
              </span>
              <div className="explore-popular-item__content">
                <h3>{getRestaurantName(item)}</h3>
                <p>
                  <span>{item.category === 'Cafe' ? t('map.filters.cafe') : t('map.filters.food')}</span>
                  <span className="text-dot" aria-hidden="true" />
                  {getRestaurantAddress(item)}
                </p>
              </div>
              <button
                type="button"
                className="explore-popular-item__more"
                aria-label={t('listDetail.moreActionsFor', { name: getRestaurantName(item) })}
                aria-expanded={openMenuId === item.id}
                onClick={(event) => {
                  event.stopPropagation()
                  setOpenMenuId((currentId) => (currentId === item.id ? null : item.id))
                }}
              >
                <img src={moreDotsIcon} alt="" aria-hidden="true" />
              </button>

              {openMenuId === item.id && (
                <RestaurantContextMenu
                  itemName={getRestaurantName(item)}
                  onAdd={() => {
                    setOpenMenuId(null)
                    onAddToList()
                  }}
                  onReport={() => {
                    setOpenMenuId(null)
                    onReportIncorrect()
                  }}
                />
              )}
            </article>
          ))}
        </div>
      </div>

      {openMenuItem && (
        <button
          type="button"
          className="explore-popular-item__backdrop"
          aria-label={t('listDetail.closeActionsFor', { name: getRestaurantName(openMenuItem) })}
          onClick={() => setOpenMenuId(null)}
        />
      )}
    </div>
  )
}
