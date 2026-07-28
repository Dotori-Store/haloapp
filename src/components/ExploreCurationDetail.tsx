import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import foodIcon from '../assets/icons/ico-cat-food.svg'
import backArrowIcon from '../assets/icons/ico-back-arrow.svg'
import moreDotsIcon from '../assets/icons/ico-more-dots.svg'
import curationSlideImage2 from '../assets/dummy/photo-cover.jpg'
import { RestaurantContextMenu } from './RestaurantContextMenu'
import './ExplorePage.css'
import './ExploreCurationDetail.css'

type CurationCard = {
  id: string
  title: string
  author: string
  image: string
}

type ExploreCurationDetailProps = {
  card: CurationCard
  onBack: () => void
  onAddToList: () => void
  onReportIncorrect: () => void
}

type MentionedRestaurant = {
  id: string
  name: string
  category: 'Cafe' | 'Restaurant'
  address: string
  icon: string
}

const mentionedRestaurants: MentionedRestaurant[] = [
  {
    id: 'mentioned-1',
    name: 'Dajunghan restaurant',
    category: 'Restaurant',
    address: '107, 1F, 2129-1, Jangan-gu, Suwon-si',
    icon: foodIcon,
  },
  {
    id: 'mentioned-2',
    name: 'Ondal korean restaurant',
    category: 'Restaurant',
    address: '107, 1F, 2129-1, Jangan-gu, Suwon-si',
    icon: foodIcon,
  },
]

const getIconBackground = (category: MentionedRestaurant['category']) =>
  category === 'Cafe' ? 'var(--color-point-cafe)' : 'var(--color-point-restaurant)'

export function ExploreCurationDetail({ card, onBack, onAddToList, onReportIncorrect }: ExploreCurationDetailProps) {
  const slides = useMemo(() => [card.image, curationSlideImage2, card.image], [card.image])
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const openMenuItem = useMemo(
    () => mentionedRestaurants.find((item) => item.id === openMenuId) ?? null,
    [openMenuId],
  )

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const updateCurrentSlide = () => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = window.requestAnimationFrame(() => {
      const slider = sliderRef.current
      if (!slider) {
        return
      }

      const nextIndex = Math.round(slider.scrollLeft / slider.clientWidth)
      setCurrentSlide(Math.min(slides.length - 1, Math.max(0, nextIndex)))
    })
  }

  return (
    <div className="curation-detail">
      <section className="curation-detail__hero" aria-label={card.title}>
        <img src={card.image} alt="" aria-hidden="true" className="curation-detail__hero-image" />
        <div className="curation-detail__overlay" aria-hidden="true" />

          <div className="curation-detail__hero-header screen-header">
            <div className="screen-header__slot">
              <button
                type="button"
                className="screen-header__button screen-header__button--light"
                aria-label="Back"
                onClick={onBack}
              >
                <img src={backArrowIcon} alt="" aria-hidden="true" />
              </button>
            </div>
          <div className="screen-header__title screen-header__title--light">
            <h1 className="head-title">halo Curation</h1>
          </div>
          <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />
        </div>

        <div className="curation-detail__hero-copy">
          <h2 className="curation-detail__title">{card.title}</h2>
          <p className="curation-detail__author">{card.author}</p>
        </div>
      </section>

      <div className="curation-detail__content">
        <section className="curation-detail__section">
          <h2 className="section-title">Introduction</h2>
          <p className="curation-detail__text">
            This is a hidden gem near the Sungkyunkwan University shuttle bus stop that offers both great value
            and taste. Thanks to the generous hospitality typical of a university district and a cozy atmosphere,
            it is highly popular for solo diners as well as for casual meals with friends.
          </p>
        </section>

        <section className="curation-detail__section">
          <div className="curation-detail__gallery">
            <div ref={sliderRef} className="curation-detail__slider" onScroll={updateCurrentSlide}>
              {slides.map((image, index) => (
                <article className="curation-detail__slide" key={`${card.id}-${index}`}>
                  <img src={image} alt="" aria-hidden="true" className="curation-detail__slide-image" />
                </article>
              ))}
            </div>

            <div className="curation-detail__pagination" aria-label={`Slide ${currentSlide + 1} of ${slides.length}`}>
              {currentSlide + 1}/{slides.length}
            </div>
          </div>
        </section>

        <section className="curation-detail__section" aria-label="Mentioned Restaurant">
          <h2 className="section-title">Mentioned Restaurant</h2>
          <div className="explore-popular curation-detail__restaurants">
            {mentionedRestaurants.map((item) => (
              <article className="explore-popular-item curation-detail__restaurant-item" key={item.id}>
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
