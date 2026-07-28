import { useMemo, useState, type CSSProperties } from 'react'
import foodIcon from '../assets/icons/ico-cat-food.svg'
import cafeIcon from '../assets/icons/ico-cat-cafe.svg'
import arrowMoreIcon from '../assets/icons/ico-arrow-more_xs.svg'
import moreDotsIcon from '../assets/icons/ico-more-dots.svg'
import albumCover from '../assets/dummy/album-cover.jpg'
import curationFoodImage from '../assets/dummy/photo-food.jpg'
import curationCoverImage from '../assets/dummy/photo-cover.jpg'
import friendAvatarImage from '../assets/dummy/thumb-user.jpg'
import friendAvatarImageAlt from '../assets/dummy/thumb-user-2.jpg'
import { ExploreCurationDetail } from './ExploreCurationDetail'
import { LovedListDetailPage } from './LovedListDetailPage'
import { LovedListPage } from './LovedListPage'
import { PopularRestaurantPage } from './PopularRestaurantPage'
import { RestaurantContextMenu } from './RestaurantContextMenu'
import './ExplorePage.css'

type PopularCategory = 'Cafe' | 'Restaurant'

type CurationCard = {
  id: string
  title: string
  author: string
  image: string
}

type PopularRestaurant = {
  id: string
  name: string
  category: PopularCategory
  address: string
  icon: string
}

type LovedList = {
  id: string
  title: string
  owner: string
  date: string
  count: number
  image: string
}

type Friend = {
  id: string
  name: string
  avatar: string
}

type ExplorePageProps = {
  onAddToList: () => void
  onReportIncorrect: () => void
}

const curationCards: CurationCard[] = [
  {
    id: 'curation-1',
    title: 'Recommended Restaurants near Sungkyunkwan University',
    author: 'halo',
    image: curationFoodImage,
  },
  {
    id: 'curation-2',
    title: 'Recommended Cafes near Han River Park',
    author: 'halo',
    image: curationCoverImage,
  },
]

const popularRestaurants: PopularRestaurant[] = [
  {
    id: 'popular-1',
    name: 'oozycoffee',
    category: 'Cafe',
    address: '107, 1F, 2129-1, Seobu-ro, Suwon-si',
    icon: cafeIcon,
  },
  {
    id: 'popular-2',
    name: 'Dajunghan restaurant',
    category: 'Restaurant',
    address: '107, 1F, 2129-1, Seobu-ro, Suwon-si',
    icon: foodIcon,
  },
  {
    id: 'popular-3',
    name: 'Betterday coffee',
    category: 'Cafe',
    address: '107, 1F, 2129-1, Seobu-ro, Suwon-si',
    icon: cafeIcon,
  },
  {
    id: 'popular-4',
    name: 'Ondal korean restaurant',
    category: 'Restaurant',
    address: '107, 1F, 2129-1, Seobu-ro, Suwon-si',
    icon: foodIcon,
  },
]

const lovedLists: LovedList[] = [
  {
    id: 'loved-1',
    title: 'Rainy day cafe',
    owner: 'Hassan',
    date: '2026.08.19',
    count: 8,
    image: albumCover,
  },
  {
    id: 'loved-2',
    title: 'Soul food',
    owner: 'Charlotte',
    date: '2026.08.19',
    count: 12,
    image: albumCover,
  },
]

const friends: Friend[] = [
  { id: 'friend-1', name: 'Olivia', avatar: friendAvatarImageAlt },
  { id: 'friend-2', name: 'Lucas', avatar: friendAvatarImage },
  { id: 'friend-3', name: 'James', avatar: friendAvatarImage },
]

const getIconBackground = (category: PopularCategory) =>
  category === 'Cafe' ? 'var(--color-point-cafe)' : 'var(--color-point-restaurant)'

export function ExplorePage({ onAddToList, onReportIncorrect }: ExplorePageProps) {
  const [selectedCurationId, setSelectedCurationId] = useState<string | null>(null)
  const [selectedPopularScreen, setSelectedPopularScreen] = useState(false)
  const [selectedLovedListScreen, setSelectedLovedListScreen] = useState(false)
  const [selectedLovedListId, setSelectedLovedListId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const selectedCuration = curationCards.find((card) => card.id === selectedCurationId) ?? null
  const selectedLovedList = lovedLists.find((item) => item.id === selectedLovedListId) ?? null
  const openMenuItem = useMemo(
    () => popularRestaurants.find((item) => item.id === openMenuId) ?? null,
    [openMenuId],
  )

  if (selectedPopularScreen) {
    return (
      <PopularRestaurantPage
        onBack={() => {
          setSelectedPopularScreen(false)
        }}
        onAddToList={onAddToList}
        onReportIncorrect={onReportIncorrect}
      />
    )
  }

  if (selectedLovedListScreen) {
    return (
      <LovedListPage
        onBack={() => {
          setSelectedLovedListScreen(false)
        }}
        onAddToList={onAddToList}
        onReportIncorrect={onReportIncorrect}
      />
    )
  }

  if (selectedLovedList) {
    return (
      <LovedListDetailPage
        listItem={selectedLovedList}
        onBack={() => {
          setSelectedLovedListId(null)
        }}
        onAddToList={onAddToList}
        onReportIncorrect={onReportIncorrect}
      />
    )
  }

  if (selectedCuration) {
    return (
      <ExploreCurationDetail
        card={selectedCuration}
        onBack={() => {
          setSelectedCurationId(null)
        }}
        onAddToList={onAddToList}
        onReportIncorrect={onReportIncorrect}
      />
    )
  }

  return (
    <div className="explore-page" onClick={() => setOpenMenuId(null)}>
      <header className="explore-page__header">
        <h1 className="page-title">Explore</h1>
      </header>

      <div className="explore-page__content">
        <section className="explore-curation">
          <h2 className="section-title explore-curation__title">halo Curation</h2>
          <div className="explore-curation__viewport">
            <div className="explore-curation__track" aria-label="Curated places">
              {curationCards.map((card) => (
                <article
                  className="explore-curation-card"
                  key={card.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${card.title}`}
                  onClick={() => setSelectedCurationId(card.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedCurationId(card.id)
                    }
                  }}
                >
                  <img src={card.image} alt="" aria-hidden="true" />
                  <div className="explore-curation-card__overlay">
                    <h2>{card.title}</h2>
                    <p>{card.author}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="explore-section" aria-label="Popular Restaurant">
          <button
            type="button"
            className="explore-section__header"
            style={{ width: '100%', border: 0, padding: 0, background: 'transparent', cursor: 'pointer' }}
            onClick={() => setSelectedPopularScreen(true)}
          >
            <h2 className="section-title">Popular Restaurant</h2>
            <img src={arrowMoreIcon} alt="" aria-hidden="true" className="explore-section__arrow" />
          </button>

          <div className="explore-popular">
            {popularRestaurants.map((item) => (
              <article className="explore-popular-item" key={item.id} onClick={() => setOpenMenuId(null)}>
                <span
                  className="explore-popular-item__icon"
                  style={{ '--place-icon-bg': getIconBackground(item.category) } as CSSProperties}
                >
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
        </section>

        <section className="explore-section" aria-label="Loved List">
          <button
            type="button"
            className="explore-section__header"
            style={{ width: '100%', border: 0, padding: 0, background: 'transparent', cursor: 'pointer' }}
            onClick={() => setSelectedLovedListScreen(true)}
          >
            <h2 className="section-title">Loved List</h2>
            <img src={arrowMoreIcon} alt="" aria-hidden="true" className="explore-section__arrow" />
          </button>

          <div className="explore-loved">
            {lovedLists.map((listItem) => (
            <article
              className="my-list-card"
              key={listItem.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedLovedListId(listItem.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setSelectedLovedListId(listItem.id)
                }
              }}
            >
                <div className="my-list-card__media">
                  <img src={listItem.image} alt="" aria-hidden="true" />
                  <span className="my-list-card__count">{listItem.count}</span>
                </div>
                <div className="my-list-cover-content">
                  <h3>{listItem.title}</h3>
                  <p>{listItem.owner}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="explore-section explore-friends" aria-label="halo friend">
          <header className="explore-section__header">
            <h2 className="section-title">halo friend</h2>
          </header>

          <div className="explore-friends__rail">
            {friends.map((friend) => (
              <article className="explore-friend" key={friend.id}>
                <img src={friend.avatar} alt="" aria-hidden="true" className="explore-friend__avatar" />
                <h3>{friend.name}</h3>
              </article>
            ))}
          </div>
        </section>
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
