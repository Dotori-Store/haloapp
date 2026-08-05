import { type CSSProperties } from 'react'
import backArrowIcon from '../assets/icons/ico-back-arrow.svg'
import addIcon from '../assets/icons/ico-keep.svg'
import foodIcon from '../assets/icons/ico-cat-food.svg'
import cafeIcon from '../assets/icons/ico-cat-cafe.svg'
import { useTranslation } from 'react-i18next'
import './ExplorePage.css'
import './PopularRestaurantPage.css'
import './ListDetailPage.css'

type AddRestaurantCategory = 'Cafe' | 'Restaurant'

type AddRestaurantItem = {
  id: string
  name: string
  nameKo?: string
  category: AddRestaurantCategory
  address: string
  addressKo?: string
  icon: string
}

type ListAddRestaurantPageProps = {
  onBack: () => void
  onAddToList: () => void
}

const restaurants: AddRestaurantItem[] = [
  {
    id: 'add-restaurant-1',
    name: 'Oozy Coffee',
    nameKo: '오지 커피',
    category: 'Cafe',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '수원시 장안구 서부로 2129-1, 1층 107호',
    icon: cafeIcon,
  },
  {
    id: 'add-restaurant-2',
    name: 'Dajunghan Korean Restaurant',
    nameKo: '다정한 식당',
    category: 'Restaurant',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '수원시 장안구 서부로 2129-1, 1층 107호',
    icon: foodIcon,
  },
  {
    id: 'add-restaurant-3',
    name: 'Betterday Coffee',
    nameKo: '베러데이 커피',
    category: 'Cafe',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '수원시 장안구 서부로 2129-1, 1층 107호',
    icon: cafeIcon,
  },
  {
    id: 'add-restaurant-4',
    name: 'Ondal Korean Restaurant',
    nameKo: '온달 한식당',
    category: 'Restaurant',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '수원시 장안구 서부로 2129-1, 1층 107호',
    icon: foodIcon,
  },
  {
    id: 'add-restaurant-5',
    name: 'Jisoo Korean Restaurant',
    nameKo: '지수 한식당',
    category: 'Restaurant',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '수원시 장안구 서부로 2129-1, 1층 107호',
    icon: foodIcon,
  },
  {
    id: 'add-restaurant-6',
    name: 'Andong Galbi Korean Restaurant',
    nameKo: '안동갈비 한식당',
    category: 'Restaurant',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '수원시 장안구 서부로 2129-1, 1층 107호',
    icon: foodIcon,
  },
  {
    id: 'add-restaurant-7',
    name: 'Morning Bean',
    nameKo: '모닝빈',
    category: 'Cafe',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '수원시 장안구 서부로 2129-1, 1층 107호',
    icon: cafeIcon,
  },
  {
    id: 'add-restaurant-8',
    name: 'Jeong Korean Restaurant',
    nameKo: '정 한식당',
    category: 'Restaurant',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '수원시 장안구 서부로 2129-1, 1층 107호',
    icon: foodIcon,
  },
]

const getIconBackground = (category: AddRestaurantCategory) =>
  category === 'Cafe' ? 'var(--color-point-cafe)' : 'var(--color-point-restaurant)'

export function ListAddRestaurantPage({ onBack, onAddToList }: ListAddRestaurantPageProps) {
  const { t, i18n } = useTranslation()
  const isKorean = i18n.language.startsWith('ko')

  return (
    <div className="popular-restaurant-page">
      <div className="popular-restaurant-page__header screen-header">
        <div className="screen-header__slot">
          <button type="button" className="screen-header__button" aria-label={t('shared.back')} onClick={onBack}>
            <img src={backArrowIcon} alt="" aria-hidden="true" />
          </button>
        </div>
        <div className="screen-header__title">
          <h1 className="head-title">{t('listDetail.addRestaurant')}</h1>
        </div>
        <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />
      </div>

      <div className="popular-restaurant-page__content">
        <div className="explore-popular popular-restaurant-page__list">
          {restaurants.map((item) => {
            const itemName = isKorean && item.nameKo ? item.nameKo : item.name
            const itemAddress = isKorean && item.addressKo ? item.addressKo : item.address

            return (
              <article className="explore-popular-item" key={item.id}>
                <span className="explore-popular-item__icon" style={{ '--place-icon-bg': getIconBackground(item.category) } as CSSProperties}>
                  <img src={item.icon} alt="" aria-hidden="true" />
                </span>
                <div className="explore-popular-item__content">
                  <h3>{itemName}</h3>
                  <p>
                    <span>{item.category === 'Cafe' ? t('map.filters.cafe') : t('map.filters.food')}</span>
                    <span className="text-dot" aria-hidden="true" />
                    {itemAddress}
                  </p>
                </div>
                <button
                  type="button"
                  className="nearby-item__keep"
                  aria-label={t('listDetail.addToList', { name: itemName })}
                  onClick={onAddToList}
                >
                  <img src={addIcon} alt="" aria-hidden="true" />
                </button>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
