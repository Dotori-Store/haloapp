import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import backArrowIcon from '../assets/icons/ico-back-arrow.svg'
import shareIconLg from '../assets/icons/ico-share-lg.svg'
import moreDotsIconLg from '../assets/icons/ico-more-dots-lg.svg'
import headerInviteIcon from '../assets/icons/ico-context-share.svg'
import headerEditIcon from '../assets/icons/ico-context-edit.svg'
import headerDeleteIcon from '../assets/icons/ico-context-delete.svg'
import mapIcon from '../assets/icons/ico-nav-map.svg'
import foodIcon from '../assets/icons/ico-cat-food.svg'
import cafeIcon from '../assets/icons/ico-cat-cafe.svg'
import addPlusIcon from '../assets/icons/ico-add-plus-xs.svg'
import addItemIcon from '../assets/icons/ico-top-add.svg'
import keepIcon from '../assets/icons/ico-keep.svg'
import itemDeleteIcon from '../assets/icons/ico-delete-xs.svg'
import itemShareIcon from '../assets/icons/ico-share.svg'
import moreDotsIcon from '../assets/icons/ico-more-dots.svg'
import { type LovedListItem } from './LovedListDetailPage'
import { ListCollaborationSheet } from './ListCollaborationSheet'
import { ListEditSheet, type ListEditRestaurant } from './ListEditSheet'
import './ExplorePage.css'
import './ListDetailPage.css'

type ListDetailPageProps = {
  listItem: LovedListItem
  onBack: () => void
  onAddRestaurant: (listId: string) => void
  onAddToList: () => void
  onViewOnMap: (listItem: LovedListItem) => void
  onSaveList: (listItem: LovedListItem) => void
}

const initialRestaurants: ListEditRestaurant[] = [
  {
    id: 'list-restaurant-1',
    name: 'Ondal korean restaurant',
    category: 'Restaurant',
    address: 'Restaurant · 107, 1F, 2129-1, Jang-an-gu, Suwon-si',
    icon: foodIcon,
  },
  {
    id: 'list-restaurant-2',
    name: 'Dajunghan restaurant',
    category: 'Restaurant',
    address: 'Restaurant · 107, 1F, 2129-1, Jang-an-gu, Suwon-si',
    icon: foodIcon,
  },
]

const recommendPlaces: ListEditRestaurant[] = [
  {
    id: 'recommend-1',
    name: 'Dajunghan restaurant',
    category: 'Restaurant',
    address: 'Restaurant · 107, 1F, 2129-1, Jang-an-gu, Suwon-si',
    icon: foodIcon,
  },
  {
    id: 'recommend-2',
    name: 'Ondal korean restaurant',
    category: 'Restaurant',
    address: 'Restaurant · 107, 1F, 2129-1, Jang-an-gu, Suwon-si',
    icon: foodIcon,
  },
]

const getIconBackground = (category: ListEditRestaurant['category']) =>
  category === 'Cafe' ? 'var(--color-point-cafe)' : 'var(--color-point-restaurant)'

export function ListDetailPage({ listItem, onBack, onAddRestaurant, onAddToList, onViewOnMap, onSaveList }: ListDetailPageProps) {
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  const [openRestaurantMenuId, setOpenRestaurantMenuId] = useState<string | null>(null)
  const [isCollaborationSheetOpen, setIsCollaborationSheetOpen] = useState(false)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [restaurants, setRestaurants] = useState<ListEditRestaurant[]>(initialRestaurants)

  const openRestaurantMenuItem = useMemo(
    () => restaurants.find((item) => item.id === openRestaurantMenuId) ?? null,
    [openRestaurantMenuId],
  )

  useEffect(() => {
    setRestaurants(initialRestaurants)
    setIsHeaderMenuOpen(false)
    setOpenRestaurantMenuId(null)
    setIsCollaborationSheetOpen(false)
    setIsEditSheetOpen(false)
  }, [listItem.id])

  return (
    <div className="list-detail-page popular-restaurant-page" onClick={() => setIsHeaderMenuOpen(false)}>
      <header className="list-detail-page__header screen-header">
        <div className="screen-header__slot">
          <button type="button" className="screen-header__button" aria-label="Back" onClick={onBack}>
            <img src={backArrowIcon} alt="" aria-hidden="true" />
          </button>
        </div>

        <div className="screen-header__actions" onClick={(event) => event.stopPropagation()}>
          <button type="button" className="screen-header__button" aria-label="Share">
            <img src={shareIconLg} alt="" aria-hidden="true" />
          </button>
          <div className="list-detail-page__menu-wrap">
            <button
              type="button"
              className="screen-header__button"
              aria-label="More options"
              aria-expanded={isHeaderMenuOpen}
              onClick={() => setIsHeaderMenuOpen((current) => !current)}
            >
              <img src={moreDotsIconLg} alt="" aria-hidden="true" />
            </button>

            {isHeaderMenuOpen && (
              <>
                <button
                  type="button"
                  className="list-detail-page__menu-backdrop"
                  aria-label="Close list menu"
                  onClick={() => setIsHeaderMenuOpen(false)}
                />
                <div className="list-detail-page__menu" role="menu" aria-label={`${listItem.title} options`}>
                  <button
                    type="button"
                    className="list-detail-page__menu-item"
                    role="menuitem"
                    onClick={() => {
                      setIsHeaderMenuOpen(false)
                      setOpenRestaurantMenuId(null)
                      setIsCollaborationSheetOpen(true)
                    }}
                  >
                    <span className="list-detail-page__menu-icon" aria-hidden="true">
                      <img src={headerInviteIcon} alt="" aria-hidden="true" />
                    </span>
                    <span>Collaboration</span>
                  </button>
                  <button
                    type="button"
                    className="list-detail-page__menu-item"
                    role="menuitem"
                    onClick={() => {
                      setIsHeaderMenuOpen(false)
                      setOpenRestaurantMenuId(null)
                      setIsEditSheetOpen(true)
                    }}
                  >
                    <span className="list-detail-page__menu-icon" aria-hidden="true">
                      <img src={headerEditIcon} alt="" aria-hidden="true" />
                    </span>
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="list-detail-page__menu-item list-detail-page__menu-item--danger"
                    role="menuitem"
                    onClick={() => setIsHeaderMenuOpen(false)}
                  >
                    <span className="list-detail-page__menu-icon" aria-hidden="true">
                      <img src={headerDeleteIcon} alt="" aria-hidden="true" />
                    </span>
                    <span>Delete list</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="popular-restaurant-page__content list-detail-page__content">
        <section className="list-detail-page__hero" aria-label={listItem.title}>
          <img className="list-detail-page__cover" src={listItem.image} alt="" aria-hidden="true" />
          <div className="list-detail-page__title-block">
            <h1 className="list-detail-page__title">{listItem.title}</h1>
            <p className="list-detail-page__owner">{listItem.owner}</p>
            <p className="list-detail-page__date">{listItem.date}</p>
          </div>

          <div className="list-detail-page__actions">
            <button type="button" className="list-detail-page__view-map" onClick={() => onViewOnMap(listItem)}>
              <img src={mapIcon} alt="" aria-hidden="true" />
              <span>View on map</span>
            </button>
          </div>
        </section>

        <section className="list-detail-page__restaurants" aria-label="Restaurants">
          <div className="explore-popular list-detail-page__restaurant-list">
            {restaurants.map((item) => (
              <article className="explore-popular-item list-detail-page__restaurant-item" key={item.id}>
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
                  aria-expanded={openRestaurantMenuId === item.id}
                  onClick={(event) => {
                    event.stopPropagation()
                    setIsHeaderMenuOpen(false)
                    setOpenRestaurantMenuId((currentId) => (currentId === item.id ? null : item.id))
                  }}
                >
                  <img src={moreDotsIcon} alt="" aria-hidden="true" />
                </button>

                {openRestaurantMenuItem?.id === item.id && (
                  <div className="list-detail-page__restaurant-menu" role="menu" aria-label={`${item.name} actions`}>
                    <button type="button" className="list-detail-page__restaurant-menu-item" role="menuitem" onClick={() => setOpenRestaurantMenuId(null)}>
                      <span className="list-detail-page__restaurant-menu-icon" aria-hidden="true">
                        <img src={itemDeleteIcon} alt="" aria-hidden="true" />
                      </span>
                      <span>Delete</span>
                    </button>
                    <button type="button" className="list-detail-page__restaurant-menu-item" role="menuitem" onClick={() => setOpenRestaurantMenuId(null)}>
                      <span className="list-detail-page__restaurant-menu-icon" aria-hidden="true">
                        <img src={itemShareIcon} alt="" aria-hidden="true" />
                      </span>
                      <span>Share</span>
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
          <button type="button" className="list-detail-page__add-restaurant" onClick={() => onAddRestaurant(listItem.id)}>
            <span className="list-detail-page__add-restaurant-icon" aria-hidden="true">
              <img src={addItemIcon} alt="" aria-hidden="true" />
            </span>
            <span>Add Restaurant</span>
          </button>
        </section>

        <section className="list-detail-page__recommend" aria-label="Recommend place">
          <div className="list-detail-page__recommend-card">
            <h2 className="section-title">Recommend place</h2>
            {recommendPlaces.map((item) => (
              <article className="list-detail-page__recommend-item" key={item.id}>
                <span className="list-detail-page__recommend-icon" style={{ '--place-icon-bg': getIconBackground(item.category) } as CSSProperties}>
                  <img src={item.icon} alt="" aria-hidden="true" />
                </span>
                <div className="list-detail-page__recommend-content">
                  <h3>{item.name}</h3>
                  <p>{item.address}</p>
                </div>
                <button type="button" className="list-detail-page__recommend-add" aria-label={`Add ${item.name}`} onClick={onAddToList}>
                  <img src={keepIcon} alt="" aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>

      {openRestaurantMenuItem && (
        <button
          type="button"
          className="explore-popular-item__backdrop"
          aria-label={`Close actions for ${openRestaurantMenuItem.name}`}
          onClick={() => setOpenRestaurantMenuId(null)}
        />
      )}

      <ListEditSheet
        open={isEditSheetOpen}
        listItem={listItem}
        restaurants={restaurants}
        onClose={() => setIsEditSheetOpen(false)}
        onSave={({ listItem: updatedListItem, restaurants: updatedRestaurants }) => {
          setRestaurants(updatedRestaurants)
          onSaveList({
            ...updatedListItem,
            count: updatedRestaurants.length,
          })
        }}
      />

      <ListCollaborationSheet open={isCollaborationSheetOpen} listItem={listItem} onClose={() => setIsCollaborationSheetOpen(false)} />
    </div>
  )
}
