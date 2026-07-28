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
    name: 'Dajunghan restaurant',
    category: 'Restaurant',
    address: '107, 1F, 2129-1, Jang-an-gu, Suwon-si',
    icon: restaurantIcon,
  },
  {
    id: 'restaurant-add-2',
    name: 'Gimbab restaurant',
    category: 'Restaurant',
    address: '107, 1F, 2129-1, Jang-an-gu, Suwon-si',
    icon: restaurantIcon,
  },
]

const cafeResults: RestaurantResult[] = [
  {
    id: 'cafe-add-1',
    name: 'Oozy coffee',
    category: 'Cafe',
    address: '107, 1F, 2129-1, Jang-an-gu, Suwon-si',
    icon: cafeIcon,
  },
  {
    id: 'cafe-add-2',
    name: 'Morning bean',
    category: 'Cafe',
    address: '107, 1F, 2129-1, Jang-an-gu, Suwon-si',
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
            <button type="button" className="screen-header__button" aria-label="Close" onClick={onClose}>
              <img src={closeIcon} alt="" aria-hidden="true" />
            </button>
          </div>
          <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />
          <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />
        </header>

        <div className="add-restaurant-page__content add-restaurant-page__content--complete">
          <img src={successIcon} alt="" aria-hidden="true" className="add-restaurant-page__success-icon" />
          <div className="add-restaurant-page__complete-copy">
            <h1 className="page-title">Thank you for adding</h1>
            <p>The restaurant you registered has been added to halo.</p>
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
            <button type="button" className="screen-header__button" aria-label="Back" onClick={() => setRegisterStep('question')}>
              <img src={backArrowIcon} alt="" aria-hidden="true" />
            </button>
          </div>
          <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />
          <div className="screen-header__slot">
            <button
              type="button"
              className={`screen-header__button add-restaurant-page__confirm ${isListSelected ? 'is-active' : ''}`}
              aria-label="Confirm list"
              disabled={!isListSelected}
              onClick={() => setRegisterStep('complete')}
            >
              <img src={topCheckIcon} alt="" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="add-restaurant-page__content add-restaurant-page__content--list">
          <RestaurantSummary restaurant={selectedRestaurant} />

          <section className="add-restaurant-page__list-section" aria-label="Add your list">
            <h2>Add your list</h2>
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
            <button type="button" className="screen-header__button" aria-label="Back" onClick={resetToSearch}>
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

          <section className="add-restaurant-page__question" aria-label="Pork-free confirmation">
            <h2>Are you sure it&apos;s pork-free?</h2>
            <p>Please tell me the exact facts.</p>

            <div className="add-restaurant-page__answer-tabs" role="tablist" aria-label="Pork-free answer">
              <button
                type="button"
                role="tab"
                aria-selected={porkFreeAnswer === 'not-sure'}
                className={`add-restaurant-page__answer ${porkFreeAnswer === 'not-sure' ? 'is-active' : ''}`}
                onClick={() => setPorkFreeAnswer('not-sure')}
              >
                Not sure
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={porkFreeAnswer === 'sure'}
                className={`add-restaurant-page__answer ${porkFreeAnswer === 'sure' ? 'is-active' : ''}`}
                onClick={() => setPorkFreeAnswer('sure')}
              >
                Yes I&apos;m sure
              </button>
            </div>
          </section>

          {isSure && (
            <section className="add-restaurant-page__extra" aria-label="Additional restaurant information">
              <label className="add-restaurant-page__comment">
                <span>Make a comment</span>
                <input type="text" placeholder="The menu I recommend is ..." />
              </label>

              <div className="add-restaurant-page__photos">
                <p>Share photos if you have any</p>
                <div className="add-restaurant-page__photo-grid">
                  <button type="button" className="add-restaurant-page__photo-add" aria-label="Add photo">
                    <img src={grayCameraIcon} alt="" aria-hidden="true" />
                  </button>

                  {samplePhotos.map((photo, index) => (
                    <div className="add-restaurant-page__photo" key={`${photo}-${index}`}>
                      <img src={photo} alt="" aria-hidden="true" />
                      <button type="button" className="add-restaurant-page__photo-remove" aria-label="Remove photo">
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
          <button type="button" className="screen-header__button" aria-label="Back" onClick={onClose}>
            <img src={backArrowIcon} alt="" aria-hidden="true" />
          </button>
        </div>

        <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />

        <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />
      </header>

      <div className="add-restaurant-page__content">
        <h1 className="page-title add-restaurant-page__title">Search for restaurant name</h1>

        <div className="add-restaurant-page__filters" role="tablist" aria-label="Restaurant type">
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'restaurant'}
            className={`add-restaurant-page__chip ${activeCategory === 'restaurant' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('restaurant')}
          >
            restaurant
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'cafe'}
            className={`add-restaurant-page__chip ${activeCategory === 'cafe' ? 'is-active' : ''}`}
            onClick={() => setActiveCategory('cafe')}
          >
            cafe
          </button>
        </div>

        <label className="add-restaurant-page__field" aria-label="Search restaurant name">
          <img src={searchIcon} alt="" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="add-restaurant-page__clear"
              aria-label="Clear search"
              onClick={() => setSearchQuery('')}
            >
              <img src={deleteTextIcon} alt="" aria-hidden="true" />
            </button>
          )}
        </label>

        <div className="add-restaurant-page__results" aria-label="Restaurant search results">
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
                  <span>{item.category}</span>
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
  return (
    <section className="add-restaurant-page__register-hero" aria-label={restaurant.name}>
      <p className="add-restaurant-page__register-category">{restaurant.category.toLowerCase()}</p>
      <h1 className="page-title add-restaurant-page__register-title">{restaurant.name}</h1>
      <p className="add-restaurant-page__register-address">Seoul, Seongbuk District, Samsungdong 12gil 82</p>
    </section>
  )
}
