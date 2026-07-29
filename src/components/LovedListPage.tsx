import { useState } from 'react'
import backArrowIcon from '../assets/icons/ico-back-arrow.svg'
import albumCover from '../assets/dummy/album-cover.jpg'
import curationCoverImage from '../assets/dummy/photo-cover.jpg'
import curationFoodImage from '../assets/dummy/photo-food.jpg'
import { LovedListDetailPage, type LovedListItem } from './LovedListDetailPage'
import { useTranslation } from 'react-i18next'
import './ExplorePage.css'

type LovedListPageProps = {
  onBack: () => void
  onAddToList: () => void
  onReportIncorrect: () => void
  onViewListOnMap: (listItem: LovedListItem) => void
}

const lovedLists: LovedListItem[] = [
  { id: 'loved-1', title: 'Rainy day cafe', owner: 'Hassan', date: '2026.08.19', count: 8, image: albumCover },
  { id: 'loved-2', title: 'Sunny mood', owner: 'Hassan', date: '2026.08.19', count: 12, image: curationCoverImage },
  { id: 'loved-3', title: 'dark cafe', owner: 'James', date: '2026.08.19', count: 4, image: curationFoodImage },
  { id: 'loved-4', title: 'green street', owner: 'James', date: '2026.08.19', count: 3, image: albumCover },
]

export function LovedListPage({ onBack, onAddToList, onReportIncorrect, onViewListOnMap }: LovedListPageProps) {
  const { t } = useTranslation()
  const [selectedList, setSelectedList] = useState<LovedListItem | null>(null)

  if (selectedList) {
    return (
      <LovedListDetailPage
        listItem={selectedList}
        onBack={() => {
          setSelectedList(null)
        }}
        onAddToList={onAddToList}
        onReportIncorrect={onReportIncorrect}
        onViewOnMap={onViewListOnMap}
      />
    )
  }

  return (
    <div className="loved-list-page popular-restaurant-page">
      <div className="popular-restaurant-page__header screen-header">
        <div className="screen-header__slot">
          <button type="button" className="screen-header__button" aria-label={t('shared.back')} onClick={onBack}>
            <img src={backArrowIcon} alt="" aria-hidden="true" />
          </button>
        </div>
        <div className="screen-header__title">
          <h1 className="head-title">{t('explore.lovedListTitle')}</h1>
        </div>
        <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />
      </div>

      <div className="popular-restaurant-page__content">
        <div className="explore-loved loved-list-page__grid">
          {lovedLists.map((listItem) => (
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
      </div>
    </div>
  )
}
