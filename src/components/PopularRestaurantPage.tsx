import { useMemo, useState, type CSSProperties } from 'react'
import backArrowIcon from '../assets/icons/ico-back-arrow.svg'
import foodIcon from '../assets/icons/ico-cat-food.svg'
import cafeIcon from '../assets/icons/ico-cat-cafe.svg'
import moreDotsIcon from '../assets/icons/ico-more-dots.svg'
import { RestaurantContextMenu } from './RestaurantContextMenu'
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
  { id: 'popular-1', name: 'oozycoffee', category: 'Cafe', address: '107, 1F, 2129-1, Seobu-ro, Jang-an-gu, Suwon-si', icon: cafeIcon },
  { id: 'popular-2', name: 'Dajunghan restaurant', category: 'Restaurant', address: '107, 1F, 2129-1, Seobu-ro, Jang-an-gu, Suwon-si', icon: foodIcon },
  { id: 'popular-3', name: 'Betterday coffee', category: 'Cafe', address: '107, 1F, 2129-1, Seobu-ro, Jang-an-gu, Suwon-si', icon: cafeIcon },
  { id: 'popular-4', name: 'Ondal korean restaurant', category: 'Restaurant', address: '107, 1F, 2129-1, Seobu-ro, Jang-an-gu, Suwon-si', icon: foodIcon },
  { id: 'popular-5', name: 'Jeju korean restaurant', category: 'Restaurant', address: '107, 1F, 2129-1, Seobu-ro, Jang-an-gu, Suwon-si', icon: foodIcon },
  { id: 'popular-6', name: 'Andong galbi korean restaurant', category: 'Restaurant', address: '107, 1F, 2129-1, Seobu-ro, Jang-an-gu, Suwon-si', icon: foodIcon },
  { id: 'popular-7', name: 'Betterday coffee', category: 'Cafe', address: '107, 1F, 2129-1, Seobu-ro, Jang-an-gu, Suwon-si', icon: cafeIcon },
  { id: 'popular-8', name: 'Onjung korean restaurant', category: 'Restaurant', address: '107, 1F, 2129-1, Seobu-ro, Jang-an-gu, Suwon-si', icon: foodIcon },
]

const getIconBackground = (category: RestaurantCategory) =>
  category === 'Cafe' ? 'var(--color-point-cafe)' : 'var(--color-point-restaurant)'

export function PopularRestaurantPage({ onBack, onAddToList, onReportIncorrect }: PopularRestaurantPageProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const openMenuItem = useMemo(() => restaurants.find((item) => item.id === openMenuId) ?? null, [openMenuId])

  return (
    <div className="popular-restaurant-page">
      <div className="popular-restaurant-page__header screen-header">
        <div className="screen-header__slot">
          <button type="button" className="screen-header__button" aria-label="Back" onClick={onBack}>
            <img src={backArrowIcon} alt="" aria-hidden="true" />
          </button>
        </div>
        <div className="screen-header__title">
          <h1 className="head-title">Popular Restaurant</h1>
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
                <h3>{item.name}</h3>
                <p>
                  <span>{item.category}</span>
                  <span className="text-dot" aria-hidden="true" />
                  {item.address}
                </p>
              </div>
              <button
                type="button"
                className="explore-popular-item__more"
                aria-label={`More actions for ${item.name}`}
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
                  itemName={item.name}
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
          aria-label={`Close actions for ${openMenuItem.name}`}
          onClick={() => setOpenMenuId(null)}
        />
      )}
    </div>
  )
}
