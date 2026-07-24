import navExploreActiveIcon from '../assets/icons/ico-nav-explore-active.svg'
import navExploreIcon from '../assets/icons/ico-nav-explore.svg'
import navListActiveIcon from '../assets/icons/ico-nav-list-active.svg'
import navListIcon from '../assets/icons/ico-nav-list.svg'
import navMapActiveIcon from '../assets/icons/ico-nav-map-active.svg'
import navMapIcon from '../assets/icons/ico-nav-map.svg'
import navMyActiveIcon from '../assets/icons/ico-nav-my-active.svg'
import navMyIcon from '../assets/icons/ico-nav-my.svg'
import navPlusActiveIcon from '../assets/icons/ico-nav-plus-active.svg'
import navPlusIcon from '../assets/icons/ico-nav-plus.svg'
import './BottomNav.css'

type NavIconProps = {
  active: string
  inactive: string
}

function NavIcon({ active, inactive }: NavIconProps) {
  return (
    <span className="bottom-nav__icon">
      <img src={active} alt="" aria-hidden="true" className="bottom-nav__icon-active" />
      <img src={inactive} alt="" aria-hidden="true" className="bottom-nav__icon-inactive" />
    </span>
  )
}

export function BottomNav() {
  return (
    <div className="bottom-row">
      <nav className="bottom-nav" aria-label="Primary navigation">
        <div className="bottom-nav__items">
          <button type="button" className="bottom-nav__item is-active" aria-label="Map">
            <NavIcon active={navMapActiveIcon} inactive={navMapIcon} />
            <span>Map</span>
          </button>
          <button type="button" className="bottom-nav__item" aria-label="List">
            <NavIcon active={navListActiveIcon} inactive={navListIcon} />
            <span>List</span>
          </button>
          <button type="button" className="bottom-nav__item" aria-label="Explore">
            <NavIcon active={navExploreActiveIcon} inactive={navExploreIcon} />
            <span>Explore</span>
          </button>
          <button type="button" className="bottom-nav__item" aria-label="My">
            <NavIcon active={navMyActiveIcon} inactive={navMyIcon} />
            <span>My</span>
          </button>
        </div>
      </nav>
      <button type="button" className="bottom-nav__add" aria-label="Add">
        <img src={navPlusIcon} alt="" aria-hidden="true" className="bottom-nav__add-inactive" />
        <img src={navPlusActiveIcon} alt="" aria-hidden="true" className="bottom-nav__add-active" />
      </button>
    </div>
  )
}
