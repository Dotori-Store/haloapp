import addToIcon from '../assets/icons/ico-add-to.svg'
import reportIcon from '../assets/icons/ico-context-report.svg'

type RestaurantContextMenuProps = {
  itemName: string
  onAdd: () => void
  onReport: () => void
}

export function RestaurantContextMenu({ itemName, onAdd, onReport }: RestaurantContextMenuProps) {
  return (
    <div
      className="explore-popular-item__menu"
      role="menu"
      aria-label={`${itemName} actions`}
      onClick={(event) => event.stopPropagation()}
    >
      <button type="button" className="explore-popular-item__menu-item" role="menuitem" onClick={onAdd}>
        <span className="explore-popular-item__menu-icon explore-popular-item__menu-icon--add" aria-hidden="true">
          <img src={addToIcon} alt="" aria-hidden="true" />
        </span>
        <span>Add to list</span>
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
        <span>Report</span>
      </button>
    </div>
  )
}
