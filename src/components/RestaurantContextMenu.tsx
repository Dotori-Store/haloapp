import addToIcon from '../assets/icons/ico-add-to.svg'
import reportIcon from '../assets/icons/ico-context-report.svg'
import { useTranslation } from 'react-i18next'

type RestaurantContextMenuProps = {
  itemName: string
  onAdd: () => void
  onReport: () => void
}

export function RestaurantContextMenu({ itemName, onAdd, onReport }: RestaurantContextMenuProps) {
  const { t } = useTranslation()

  return (
    <div
      className="explore-popular-item__menu"
      role="menu"
      aria-label={t('listDetail.listItemActions', { name: itemName })}
      onClick={(event) => event.stopPropagation()}
    >
      <button type="button" className="explore-popular-item__menu-item" role="menuitem" onClick={onAdd}>
        <span className="explore-popular-item__menu-icon explore-popular-item__menu-icon--add" aria-hidden="true">
          <img src={addToIcon} alt="" aria-hidden="true" />
        </span>
        <span>{t('shared.addToList')}</span>
      </button>
      <button
        type="button"
        className="explore-popular-item__menu-item explore-popular-item__menu-item--danger"
        role="menuitem"
        onClick={onReport}
      >
        <span className="explore-popular-item__menu-icon explore-popular-item__menu-icon--report" aria-hidden="true">
          <img src={reportIcon} alt="" aria-hidden="true" />
        </span>
        <span>{t('shared.report')}</span>
      </button>
    </div>
  )
}
