import { useState } from 'react'
import addToIcon from '../assets/icons/ico-top-add.svg'
import moreDotsIconLg from '../assets/icons/ico-more-dots-lg.svg'
import editIcon from '../assets/icons/ico-context-edit.svg'
import albumCoverLikeImage from '../assets/images/album-cover-like.png'
import albumCoverCheckImage from '../assets/images/album-cover-check.png'
import albumCoverImage from '../assets/dummy/photo-cover.jpg'
import { ListAddPage } from './ListAddPage'
import { ListDetailPage } from './ListDetailPage'
import { type LovedListItem } from './LovedListDetailPage'
import './ExplorePage.css'
import './ListPage.css'

const myLists: LovedListItem[] = [
  { id: 'my-list-1', title: 'Sunny mood', owner: 'halo', date: '2025-11-12', count: 12, image: albumCoverImage },
  { id: 'my-list-2', title: 'Like', owner: 'halo', date: '2026.08.19', count: 8, image: albumCoverLikeImage },
  { id: 'my-list-3', title: 'My Registered Place', owner: 'halo', date: '2026.08.15', count: 3, image: albumCoverCheckImage },
]

type ListPageProps = {
  onAddRestaurant: () => void
  onAddToList: () => void
}

export function ListPage({ onAddRestaurant, onAddToList }: ListPageProps) {
  const [selectedList, setSelectedList] = useState<LovedListItem | null>(null)
  const [isAddListOpen, setIsAddListOpen] = useState(false)
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)

  if (isAddListOpen) {
    return <ListAddPage onClose={() => setIsAddListOpen(false)} />
  }

  if (selectedList) {
    return (
      <ListDetailPage
        listItem={selectedList}
        onBack={() => {
          setSelectedList(null)
        }}
        onAddRestaurant={onAddRestaurant}
        onAddToList={onAddToList}
      />
    )
  }

  return (
    <div className="list-page popular-restaurant-page" onClick={() => setIsHeaderMenuOpen(false)}>
      <header className="list-page__header">
        <h1 className="page-title">List</h1>

        <div className="list-page__actions" onClick={(event) => event.stopPropagation()}>
          <button
            type="button"
            className="screen-header__button"
            aria-label="Add list"
            onClick={() => {
              setIsHeaderMenuOpen(false)
              setIsAddListOpen(true)
            }}
          >
            <img src={addToIcon} alt="" aria-hidden="true" />
          </button>

          <div className="list-page__menu-wrap">
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
                  className="list-page__menu-backdrop"
                  aria-label="Close list menu"
                  onClick={() => setIsHeaderMenuOpen(false)}
                />
                <div className="list-page__menu" role="menu" aria-label="List options">
                  <button type="button" className="list-page__menu-item" role="menuitem" onClick={() => setIsHeaderMenuOpen(false)}>
                    <span className="list-page__menu-icon" aria-hidden="true">
                      <img src={editIcon} alt="" aria-hidden="true" />
                    </span>
                    <span>edit list</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="popular-restaurant-page__content list-page__content">
        <div className="explore-loved list-page__grid">
          {myLists.map((listItem) => (
            <article
              className="my-list-card"
              key={listItem.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedList(listItem)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setSelectedList(listItem)
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
      </main>
    </div>
  )
}
