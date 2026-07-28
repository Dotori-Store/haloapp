import { useState } from 'react'
import backArrowIcon from '../assets/icons/ico-back-arrow.svg'
import topCheckIcon from '../assets/icons/ico-top-check.svg'
import whiteCameraIcon from '../assets/icons/ico-white-camera.svg'
import './ExplorePage.css'
import './RestaurantAddPage.css'
import './MyPage.css'
import './ListAddPage.css'

type ListAddPageProps = {
  onClose: () => void
}

export function ListAddPage({ onClose }: ListAddPageProps) {
  const [listName, setListName] = useState('')
  const [isPublished, setIsPublished] = useState(true)

  const canSave = listName.trim().length > 0

  return (
    <div className="list-add-page">
      <header className="list-add-page__header screen-header">
        <div className="screen-header__slot">
          <button type="button" className="screen-header__button" aria-label="Back" onClick={onClose}>
            <img src={backArrowIcon} alt="" aria-hidden="true" />
          </button>
        </div>

        <div className="screen-header__title">
          <h1 className="head-title">New List</h1>
        </div>

        <div className="screen-header__slot">
          <button
            type="button"
            className={`screen-header__button add-restaurant-page__confirm ${canSave ? 'is-active' : ''}`}
            aria-label="Save list"
            disabled={!canSave}
            onClick={onClose}
          >
            <img src={topCheckIcon} alt="" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="list-add-page__content">
        <button type="button" className="list-add-page__cover-button" aria-label="Add list cover photo">
          <img className="list-add-page__cover-icon" src={whiteCameraIcon} alt="" aria-hidden="true" />
        </button>

        <label className="list-add-page__field">
          <input
            type="text"
            value={listName}
            placeholder="Enter list name"
            onChange={(event) => setListName(event.target.value)}
          />
        </label>

        <section className="list-add-page__settings" aria-label="Publish list">
          <div className="my-edit__row list-add-page__row">
            <span>Publish list</span>
            <button
              type="button"
              className={`my-edit__switch ${isPublished ? 'is-on' : ''}`}
              aria-label="Publish list"
              aria-pressed={isPublished}
              onClick={() => setIsPublished((current) => !current)}
            >
              <span />
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
