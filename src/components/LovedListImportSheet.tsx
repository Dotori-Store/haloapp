import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import closeIcon from '../assets/icons/ico-close-xs.svg'
import checkDefaultIcon from '../assets/icons/ico-check-xs-default.svg'
import checkActiveIcon from '../assets/icons/ico-check-xs-active.svg'
import topCheckIcon from '../assets/icons/ico-top-check.svg'
import foodIcon from '../assets/icons/ico-cat-food.svg'
import coverLikeImage from '../assets/images/album-cover-like.png'
import albumCover from '../assets/dummy/album-cover.jpg'
import curationCoverImage from '../assets/dummy/photo-cover.jpg'
import curationFoodImage from '../assets/dummy/photo-food.jpg'
import { getLocalizedPlaceAddress, getLocalizedPlaceName } from '../data/mapPlaces'
import { useTranslation } from 'react-i18next'
import './LovedListImportSheet.css'
import './ExplorePage.css'

type LovedListImportSheetProps = {
  open: boolean
  onClose: () => void
  onComplete: (payload: { count: number; title: string; image: string }) => void
}

type DestinationList = {
  id: string
  title: string
  owner: string
  date: string
  image: string
}

type ImportRestaurant = {
  id: string
  name: string
  nameKo?: string
  category: 'Cafe' | 'Restaurant'
  address: string
  addressKo?: string
}

const destinationLists: DestinationList[] = [
  { id: 'dest-1', title: 'Rainy day cafe', owner: 'Hassan', date: '2026.08.19', image: albumCover },
  { id: 'dest-2', title: 'Sunny mood', owner: 'Hassan', date: '2026.08.19', image: curationCoverImage },
  { id: 'dest-3', title: 'dark cafe', owner: 'James', date: '2026.08.19', image: curationFoodImage },
  { id: 'dest-4', title: 'green street', owner: 'James', date: '2026.08.19', image: albumCover },
]

const importRestaurants: ImportRestaurant[] = [
  {
    id: 'import-1',
    name: 'Dajunghan Korean Restaurant',
    nameKo: '다정한 식당',
    category: 'Restaurant',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '수원시 장안구 서부로 2129-1, 1층 107호',
  },
  {
    id: 'import-2',
    name: 'Hankuk Restaurant',
    nameKo: '한국식당',
    category: 'Restaurant',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '수원시 장안구 서부로 2129-1, 1층 107호',
  },
  {
    id: 'import-3',
    name: 'Seoul Korean Restaurant',
    nameKo: '서울 한식당',
    category: 'Restaurant',
    address: '107, 1F, 2129-1, Seobu-ro, Jangan-gu',
    addressKo: '수원시 장안구 서부로 2129-1, 1층 107호',
  },
]

const getIconBackground = (category: ImportRestaurant['category']) =>
  category === 'Cafe' ? 'var(--color-point-cafe)' : 'var(--color-point-restaurant)'

export function LovedListImportSheet({ open, onClose, onComplete }: LovedListImportSheetProps) {
  const { t, i18n } = useTranslation()
  const [step, setStep] = useState<'destination' | 'import'>('destination')
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null)
  const [selectedImportIds, setSelectedImportIds] = useState<string[]>([])

  useEffect(() => {
    if (!open) {
      return
    }

    setStep('destination')
    setSelectedDestinationId(null)
    setSelectedImportIds([])
  }, [open])

  const selectedDestination = useMemo(
    () => destinationLists.find((item) => item.id === selectedDestinationId) ?? null,
    [selectedDestinationId],
  )

  const selectedImportCount = selectedImportIds.length
  const allSelected = selectedImportCount === importRestaurants.length

  if (!open) {
    return null
  }

  const toggleImportItem = (itemId: string) => {
    setSelectedImportIds((current) =>
      current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId],
    )
  }

  const toggleAllImportItems = () => {
    setSelectedImportIds((current) =>
      current.length === importRestaurants.length ? [] : importRestaurants.map((item) => item.id),
    )
  }

  const completeImport = () => {
    if (!selectedDestination || selectedImportCount === 0) {
      return
    }

    onComplete({ count: selectedImportCount, title: selectedDestination.title, image: selectedDestination.image })
    onClose()
  }

  return (
    <div className="loved-list-import-sheet" role="presentation">
      <button type="button" className="loved-list-import-sheet__backdrop" aria-label={t('shared.close')} onClick={onClose} />

      <section className="loved-list-import-sheet__panel" role="dialog" aria-modal="true" aria-label={t('list.getList')}>
        <div className="loved-list-import-sheet__handle" aria-hidden="true" />

        <header className="loved-list-import-sheet__header screen-header">
          <div className="screen-header__slot">
            <button type="button" className="screen-header__button" aria-label={t('shared.close')} onClick={onClose}>
              <img src={closeIcon} alt="" aria-hidden="true" />
            </button>
          </div>

          <div className="screen-header__title">
            <h1 className="head-title">{t('list.getList')}</h1>
          </div>

          {step === 'destination' ? (
            <div className="screen-header__slot screen-header__slot--auto">
              <button
                type="button"
                className={`loved-list-import-sheet__confirm ${selectedDestination ? 'is-active' : ''}`}
                aria-label={t('shared.confirm')}
                disabled={!selectedDestination}
                onClick={() => {
                  if (!selectedDestination) {
                    return
                  }

                  setStep('import')
                }}
              >
                <img src={topCheckIcon} alt="" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />
          )}
        </header>

        <div className="loved-list-import-sheet__body">
          {step === 'destination' ? (
            <div className="loved-list-import-sheet__destination-step">
              <div className="loved-list-import-sheet__grid">
                {destinationLists.map((item) => {
                  const isSelected = selectedDestinationId === item.id

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`loved-list-import-sheet__destination-card ${isSelected ? 'is-selected' : ''}`}
                      aria-pressed={isSelected}
                      onClick={() => setSelectedDestinationId(item.id)}
                    >
                      <span className="loved-list-import-sheet__destination-thumb">
                        <img src={item.image} alt="" aria-hidden="true" />
                        {isSelected && <span className="loved-list-import-sheet__destination-overlay" aria-hidden="true" />}
                        {isSelected && (
                          <span className="loved-list-import-sheet__destination-check" aria-hidden="true">
                            <img src={checkActiveIcon} alt="" aria-hidden="true" />
                          </span>
                        )}
                      </span>
                      <span className="loved-list-import-sheet__destination-meta">
                        <span className="loved-list-import-sheet__destination-title">{item.title}</span>
                        <span className="loved-list-import-sheet__destination-owner">{item.owner}</span>
                        <span className="loved-list-import-sheet__destination-date">{item.date}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="loved-list-import-sheet__import-step">
              {selectedDestination && (
                <section className="loved-list-import-sheet__destination-preview" aria-label={selectedDestination.title}>
                  <img className="loved-list-import-sheet__destination-preview-image" src={coverLikeImage} alt="" aria-hidden="true" />
                  <h2 className="loved-list-import-sheet__destination-preview-title">{selectedDestination.title}</h2>
                  <p className="loved-list-import-sheet__destination-preview-owner">{selectedDestination.owner}</p>
                  <p className="loved-list-import-sheet__destination-preview-date">{selectedDestination.date}</p>
                </section>
              )}

              <section className="loved-list-import-sheet__import-area" aria-label={t('list.getList')}>
                <header className="loved-list-import-sheet__import-header">
                  <div className="loved-list-import-sheet__import-copy">
                    <h2>{t('list.getList')}</h2>
                    <p>{t('list.selectListToImport')}</p>
                  </div>
                  <div className="loved-list-import-sheet__import-count">{t('shared.selected', { count: selectedImportCount })}</div>
                </header>

                <button
                  type="button"
                  className="loved-list-import-sheet__select-all"
                  aria-pressed={allSelected}
                  onClick={toggleAllImportItems}
                >
                  <span className="loved-list-import-sheet__select-all-check" aria-hidden="true">
                    <img src={allSelected ? checkActiveIcon : checkDefaultIcon} alt="" aria-hidden="true" />
                  </span>
                  <span className="loved-list-import-sheet__select-all-label">{t('shared.selectAll')}</span>
                </button>

                <div className="loved-list-import-sheet__items">
                  {importRestaurants.map((item) => {
                    const isSelected = selectedImportIds.includes(item.id)
                    const itemName = getLocalizedPlaceName(i18n.language, item)
                    const itemAddress = getLocalizedPlaceAddress(i18n.language, item)

                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`loved-list-import-sheet__item ${isSelected ? 'is-selected' : ''}`}
                        aria-pressed={isSelected}
                        onClick={() => toggleImportItem(item.id)}
                      >
                        <span className="loved-list-import-sheet__item-check" aria-hidden="true">
                          <img src={isSelected ? checkActiveIcon : checkDefaultIcon} alt="" aria-hidden="true" />
                        </span>
                        <span
                          className="loved-list-import-sheet__item-icon"
                          style={{ '--place-icon-bg': getIconBackground(item.category) } as CSSProperties}
                        >
                          <img src={foodIcon} alt="" aria-hidden="true" />
                        </span>
                        <span className="loved-list-import-sheet__item-content">
                          <span className="loved-list-import-sheet__item-title">{itemName}</span>
                          <span className="loved-list-import-sheet__item-meta">
                            <span>{item.category === 'Cafe' ? t('map.filters.cafe') : t('map.filters.food')}</span>
                            <span className="text-dot" aria-hidden="true" />
                            {itemAddress}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            </div>
          )}
        </div>

        {step === 'import' && (
          <footer className="loved-list-import-sheet__footer">
            <button
              type="button"
              className="loved-list-import-sheet__submit"
              disabled={selectedImportCount === 0}
              onClick={completeImport}
            >
              {t('list.placeGet', { count: selectedImportCount })}
            </button>
          </footer>
        )}
      </section>
    </div>
  )
}
