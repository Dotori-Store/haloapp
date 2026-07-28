import closeIcon from '../assets/icons/ico-close-xs.svg'
import foodIcon from '../assets/icons/ico-cat-food.svg'
import googleMapIcon from '../assets/icons/ico-google-map.svg'
import keepIcon from '../assets/icons/ico-keep.svg'
import naverMapIcon from '../assets/icons/ico-naver-map.svg'
import photoIcon from '../assets/icons/ico-photo-light.svg'
import wishHeartIcon from '../assets/icons/ico-wish-heart.svg'
import wishHeartActiveIcon from '../assets/icons/ico-wish-heart-active.svg'
import commentUserThumb from '../assets/dummy/thumb-user-2.jpg'
import thumbUser from '../assets/dummy/thumb-user.jpg'
import type { NearbyPlace } from '../data/places'
import './PlaceDetailSheet.css'

type PlaceDetailSheetProps = {
  place: NearbyPlace
  isWished: boolean
  isExpanded: boolean
  onClose: () => void
  onToggleWish: () => void
  onAddPhoto: () => void
  onAddToList: () => void
  onReportIncorrect: () => void
}

export function PlaceDetailSheet({
  place,
  isWished,
  isExpanded,
  onClose,
  onAddPhoto,
  onToggleWish,
  onAddToList,
  onReportIncorrect,
}: PlaceDetailSheetProps) {
  const showCommentThread = place.detailType === 2 || (place.detailType === 1 && isExpanded)
  const showCommentComposer = place.detailType !== 1 || isExpanded

  return (
    <section className="place-detail" aria-label={`${place.name} detail`}>
      <button type="button" className="place-detail__close" aria-label="Close detail" onClick={onClose}>
        <img src={closeIcon} alt="" aria-hidden="true" />
      </button>

      <header className="place-detail__header">
        <span className="place-detail__icon">
          <img src={foodIcon} alt="" aria-hidden="true" />
        </span>
        <div className="place-detail__title-block">
          <h2>{place.name}</h2>
          <p>
            <span>{place.status}</span>
            <span className="text-dot" aria-hidden="true" />
            {place.address}
          </p>
        </div>
      </header>

      <div className="place-detail__scroll">
        {place.photoUrl ? <img className="place-detail__photo" src={place.photoUrl} alt={place.name} /> : null}

        <div className="place-detail__actions">
          <button type="button" className="place-detail__map-button place-detail__map-button--naver">
            <img src={naverMapIcon} alt="" aria-hidden="true" />
            <span>NAVER MAP</span>
          </button>
          <button type="button" className="place-detail__map-button place-detail__map-button--google">
            <img src={googleMapIcon} alt="" aria-hidden="true" />
            <span>Google MAP</span>
          </button>
        </div>

        <footer className="place-detail__footer">
          <p>20 people like this</p>
          <div className="place-detail__icon-actions">
            <button
              type="button"
              className="place-detail__icon-button"
              aria-label={`${isWished ? 'Unlike' : 'Like'} ${place.name}`}
              aria-pressed={isWished}
              onClick={onToggleWish}
            >
              <img src={isWished ? wishHeartActiveIcon : wishHeartIcon} alt="" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="place-detail__icon-button"
              aria-label={`Save ${place.name} to list`}
              aria-haspopup="dialog"
              onClick={onAddToList}
            >
              <img src={keepIcon} alt="" aria-hidden="true" />
            </button>
          </div>
        </footer>

        {(showCommentThread || showCommentComposer) && (
          <section className="place-detail__community" aria-label="Comments">
            {showCommentThread && (
              <article className="place-detail__comment">
                <img src={commentUserThumb} alt="" aria-hidden="true" />
                <div>
                  <p className="place-detail__comment-meta">
                    <span>Jameson</span>
                    <span className="text-dot" aria-hidden="true" />
                    <span>1h</span>
                  </p>
                  <p className="place-detail__comment-text">wow! very nice~</p>
                </div>
              </article>
            )}

            {showCommentComposer && (
              <div className="place-detail__comment-input">
                <img src={thumbUser} alt="" aria-hidden="true" />
                <input type="text" aria-label="Leave a comment" placeholder="Leave a comment..." />
              </div>
            )}
          </section>
        )}

        {isExpanded && (
          <div className="place-detail__expanded-content">
            <dl className="place-detail__meta-list">
              <div>
                <dt>Recommend user</dt>
                <dd>halo</dd>
              </div>
              <div>
                <dt>Recommend Date</dt>
                <dd>2026.08.15</dd>
              </div>
            </dl>

            <button
              type="button"
              className="place-detail__wide-button place-detail__wide-button--photo"
              onClick={onAddPhoto}
            >
              <img src={photoIcon} alt="" aria-hidden="true" />
              <span>Add Photo</span>
            </button>
            <button
              type="button"
              className="place-detail__wide-button place-detail__wide-button--danger"
              onClick={onReportIncorrect}
            >
              Incorrect Information
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
