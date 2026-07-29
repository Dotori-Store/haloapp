import { useMemo, useState } from 'react'
import backArrowIcon from '../assets/icons/ico-back-arrow.svg'
import closeIcon from '../assets/icons/ico-close-xs.svg'
import topCheckIcon from '../assets/icons/ico-top-check.svg'
import checkActiveIcon from '../assets/icons/ico-check-xs-active.svg'
import successIcon from '../assets/icons/symbol-green-check.svg'
import searchIcon from '../assets/icons/ico-glass-gray.svg'
import deleteTextIcon from '../assets/icons/ico-delete-text.svg'
import grayCameraIcon from '../assets/icons/ico-gray-camera.svg'
import restaurantIcon from '../assets/icons/ico-cat-food.svg'
import cafeIcon from '../assets/icons/ico-cat-cafe.svg'
import rightArrowIcon from '../assets/icons/ico-right-arrow.svg'
import foodPhoto from '../assets/dummy/photo-food.jpg'
import coverPhoto from '../assets/dummy/photo-cover.jpg'
import albumCover from '../assets/dummy/album-cover.jpg'
import { useTranslation } from 'react-i18next'
import './ExplorePage.css'
import './RestaurantAddPage.css'

type RestaurantCategory = 'restaurant' | 'cafe'
type PorkFreeAnswer = 'not-sure' | 'sure'
type RegisterStep = 'question' | 'list' | 'complete'

type RestaurantResult = {
  id: string
  name: string
  category: 'Restaurant' | 'Cafe'
  address: string
  icon: string
}

type SavedList = {
  id: string
  title: string
  owner: string
  count: number
  image: string
}

type RestaurantAddPageProps = {
  onClose: () => void
}

const restaurantResults: RestaurantResult[] = [
  {
    id: 'restaurant-add-1',
    name: '다정한 식당',
    category: 'Restaurant',
    address: '수원시 장안구 서부로 2129-1, 1층 107호',
    icon: restaurantIcon,
  },
  {
    id: 'restaurant-add-2',
    name: '김밥집',
    category: 'Restaurant',
    address: '수원시 장안구 서부로 2129-1, 1층 107호',
    icon: restaurantIcon,
  },
]

const cafeResults: RestaurantResult[] = [
  {
    id: 'cafe-add-1',
    name: '오지 커피',
    category: 'Cafe',
    address: '수원시 장안구 서부로 2129-1, 1층 107호',
    icon: cafeIcon,
  },
  {
    id: 'cafe-add-2',
    name: '모닝빈',
    category: 'Cafe',
    address: '수원시 장안구 서부로 2129-1, 1층 107호',
    icon: cafeIcon,
  },
]

const savedLists: SavedList[] = [
  { id: 'list-1', title: 'Rainy day cafe', owner: 'Hassan', count: 8, image: albumCover },
  { id: 'list-2', title: 'Sunny mood', owner: 'Hassan', count: 12, image: coverPhoto },
  { id: 'list-3', title: 'dark cafe', owner: 'James', count: 4, image: foodPhoto },
  { id: 'list-4', title: 'green street', owner: 'James', count: 3, image: albumCover },
]

const samplePhotos = [foodPhoto, coverPhoto, albumCover]

export function RestaurantAddPage({ onClose }: RestaurantAddPageProps) {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState<RestaurantCategory>('restaurant')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantResult | null>(null)
  const [registerStep, setRegisterStep] = useState<RegisterStep>('question')
  const [porkFreeAnswer, setPorkFreeAnswer] = useState<PorkFreeAnswer | null>(null)
  const [selectedListId, setSelectedListId] = useState<string | null>(null)

  const results = useMemo(() => {
    if (!searchQuery.trim()) {
      return []
    }

    return activeCategory === 'restaurant' ? restaurantResults : cafeResults
  }, [activeCategory, searchQuery])

  const resetToSearch = () => {
    setSelectedRestaurant(null)
    setRegisterStep('question')
    setPorkFreeAnswer(null)
    setSelectedListId(null)
  }

  if (selectedRestaurant && registerStep === 'complete') {
    return (
      <div className="add-restaurant-page">
        <header className="add-restaurant-page__header screen-header">
          <div className="screen-header__slot">
            <button type="button" className="screen-header__button" aria-label={t('shared.close')} onClick={onClose}>
              <img src={closeIcon} alt="" aria-hidden="true" />
            </button>
          </div>
          <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />
          <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />
        </header>

        <div className="add-restaurant-page__content add-restaurant-page__content--complete">
          <img src={successIcon} alt="" aria-hidden="true" className="add-restaurant-page__success-icon" />
          <div className="add-restaurant-page__complete-copy">
            <h1 className="page-title">{t('restaurantAdd.thankYouForAdding')}</h1>
            <p>{t('restaurantAdd.restaurantAdded')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (selectedRestaurant && registerStep === 'list') {
    const isListSelected = selectedListId !== null

    return (
      <div className="add-restaurant-page">
        <header className="add-restaurant-page__header screen-header">
          <div className="screen-header__slot">
            <button type="button" className="screen-header__button" aria-label={t('shared.back')} onClick={() => setRegisterStep('question')}>
              <img src={backArrowIcon} alt="" aria-hidden="true" />
            </button>
          </div>
          <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />
          <div className="screen-header__slot">
            <button
              type="button"
              className={`screen-header__button add-restaurant-page__confirm ${isListSelected ? 'is-active' : ''}`}
              aria-label={t('shared.confirm')}
              disabled={!isListSelected}
              onClick={() => setRegisterStep('complete')}
            >
              <img src={topCheckIcon} alt="" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="add-restaurant-page__content add-restaurant-page__content--list">
          <RestaurantSummary restaurant={selectedRestaurant} />

          <section className="add-restaurant-page__list-section" aria-label={t('list.addYourList')}>
            <h2>{t('list.addYourList')}</h2>
            <div className="add-restaurant-page__list-grid">
              {savedLists.map((listItem) => {
                const isSelected = selectedListId === listItem.id

                return (
                  <button
                    key={listItem.id}
                    type="button"
                    className={`add-restaurant-page__list-card ${isSelected ? 'is-selected' : ''}`}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedListId(listItem.id)}
                  >
                    <span className="add-restaurant-page__list-media">
                      <img src={listItem.image} alt="" aria-hidden="true" />
                      <span className="add-restaurant-page__list-count">{listItem.count}</span>
                      {isSelected && <span className="add-restaurant-page__list-overlay" aria-hidden="true" />}
                      {isSelected && (
                        <span className="add-restaurant-page__list-check" aria-hidden="true">
                          <img src={checkActiveIcon} alt="" aria-hidden="true" />
                        </span>
                      )}
                    </span>
                    <span className="add-restaurant-page__list-content">
                      <span>{listItem.title}</span>
                      <span>{listItem.owner}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    )
  }

  if (selectedRestaurant) {
    const isSure = porkFreeAnswer === 'sure'
    const isAnswered = porkFreeAnswer !== null

    return (
      <div className="add-restaurant-page">
        <header className="add-restaurant-page__header screen-header">
          <div className="screen-header__slot">
            <button type="button" className="screen-header__button" aria-label={t('shared.back')} onClick={resetToSearch}>
              <img src={backArrowIcon} alt="" aria-hidden="true" />
            </button>
          </div>

          <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />

          <div className="screen-header__slot">
            <button
              type="button"
              className={`screen-header__button add-restaurant-page__confirm ${isAnswered ? 'is-active' : ''}`}
              aria-label="Confirm restaurant information"
              disabled={!isAnswered}
              onClick={() => setRegisterStep('list')}
            >
              <img src={topCheckIcon} alt="" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="add-restaurant-page__content add-restaurant-page__content--register">
          <RestaurantSummary restaurant={selectedRestaurant} />

          <section className="add-restaurant-page__question" aria-label={t('restaurantAdd.porkFreeConfirmation')}>
            <h2>Are you sure it&apos;s pork-free?</h2>
            <p>{t('restaurantAdd.pleaseTellMeTheExactFacts')}</p>

            <div className="add-restaurant-page__answer-tabs" role="tablist" aria-label={t('restaurantAdd.porkFreeAnswer')}>
              <button
                type="button"
                role="tab"
                aria-selected={porkFreeAnswer === 'not-sure'}
                className={`add-restaurant-page__answer ${porkFreeAnswer === 'not-sure' ? 'is-active' : ''}`}
                onClick={() => setPorkFreeAnswer('not-sure')}
              >
                {t('restaurantAdd.notSure')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={porkFreeAnswer === 'sure'}
                className={`add-restaurant-page__answer ${porkFreeAnswer === 'sure' ? 'is-active' : ''}`}
                onClick={() => setPorkFreeAnswer('sure')}
              >
                {t('restaurantAdd.yesImSure')}
              </button>
            </div>
          </section>

          {isSure && (
            <section className="add-restaurant-page__extra" aria-label={t('restaurantAdd.additionalInfo')}>
              <label className="add-restaurant-page__comment">
                <span>{t('restaurantAdd.makeComment')}</span>
                <input type="text" placeholder={t('restaurantAdd.commentPlaceholder')} />
              </label>

              <div className="add-restaurant-page__photos">
                <p>{t('restaurantAdd.sharePhotosIfYouHaveAny')}</p>
                <div className="add-restaurant-page__photo-grid">
                  <button type="button" className="add-restaurant-page__photo-add" aria-label={t('restaurantAdd.addPhoto')}>
                    <img src={grayCameraIcon} alt="" aria-hidden="true" />
                  </button>

                  {samplePhotos.map((photo, index) => (
                    <div className="add-restaurant-page__photo" key={`${photo}-${index}`}>
                      <img src={photo} alt="" aria-hidden="true" />
                      <button type="button" className="add-restaurant-page__photo-remove" aria-label={t('restaurantAdd.removePhoto')}>
                        <img src={closeIcon} alt="" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="add-restaurant-page">
      <header className="add-restaurant-page__header screen-header">
        <div className="screen-header__slot">
            <button type="button" className="screen-header__button" aria-label={t('shared.back')} onClick={onClose}>
            <img src={backArrowIcon} alt="" aria-hidden="true" />
          </button>
        </div>

        <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />

        <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />
      </header>

      <div className="add-restaurant-page__content">
        <h1 className="page-title add-restaurant-page__title">{t('restaurantAdd.searchTitle')}</h1>

        <div className="add-restaurant-page__filters" role="tablist" aria-label={t('restaurantAdd.restaurantType')}>
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'restaurant'}
            className={`add-restaurant-page__chip ${activeCategory === 'restaurant' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('restaurant')}
          >
            {t('restaurantAdd.restaurant')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'cafe'}
            className={`add-restaurant-page__chip ${activeCategory === 'cafe' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('cafe')}
          >
            {t('restaurantAdd.cafe')}
          </button>
        </div>

        <label className="add-restaurant-page__field" aria-label={t('restaurantAdd.searchRestaurantName')}>
          <img src={searchIcon} alt="" aria-hidden="true" />
          <input
            type="search"
            placeholder={t('restaurantAdd.search')}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="add-restaurant-page__clear"
              aria-label={t('restaurantAdd.clearSearch')}
              onClick={() => setSearchQuery('')}
            >
              <img src={deleteTextIcon} alt="" aria-hidden="true" />
            </button>
          )}
        </label>

        <div className="add-restaurant-page__results" aria-label={t('restaurantAdd.searchResults')}>
          {results.map((item) => (
            <button
              key={item.id}
              type="button"
              className="add-restaurant-page__result"
              onClick={() => setSelectedRestaurant(item)}
            >
              <span className="add-restaurant-page__result-icon">
                <img src={item.icon} alt="" aria-hidden="true" />
              </span>
              <span className="add-restaurant-page__result-content">
                <span className="add-restaurant-page__result-title">{item.name}</span>
                <span className="add-restaurant-page__result-meta">
                  <span>{item.category === 'Restaurant' ? t('restaurantAdd.restaurant') : t('restaurantAdd.cafe')}</span>
                  <span className="text-dot" aria-hidden="true" />
                  {item.address}
                </span>
              </span>
              <img src={rightArrowIcon} alt="" aria-hidden="true" className="add-restaurant-page__result-arrow" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function RestaurantSummary({ restaurant }: { restaurant: RestaurantResult }) {
  const { t } = useTranslation()

  return (
    <section className="add-restaurant-page__register-hero" aria-label={restaurant.name}>
      <p className="add-restaurant-page__register-category">
        {restaurant.category === 'Restaurant' ? t('restaurantAdd.restaurant') : t('restaurantAdd.cafe')}
      </p>
      <h1 className="page-title add-restaurant-page__register-title">{restaurant.name}</h1>
      <p className="add-restaurant-page__register-address">서울 성북구 삼성동 12길 82</p>
    </section>
  )
}
