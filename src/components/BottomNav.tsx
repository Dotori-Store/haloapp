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

export type BottomNavTab = 'map' | 'list' | 'explore' | 'my'

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

type BottomNavProps = {
  activeTab: BottomNavTab
  onChangeTab: (tab: BottomNavTab) => void
  onAdd: () => void
  variant?: 'default' | 'compactList'
}

export function BottomNav({ activeTab, onChangeTab, onAdd, variant = 'default' }: BottomNavProps) {
  if (variant === 'compactList') {
    return (
      <div className="bottom-row bottom-row--compact-list">
        <nav className="bottom-nav bottom-nav--compact-list" aria-label="Primary navigation">
          <div className="bottom-nav__items bottom-nav__items--compact-list">
            <div className="bottom-nav__item is-active" aria-label="List">
              <NavIcon active={navListActiveIcon} inactive={navListIcon} />
              <span>List</span>
            </div>
          </div>
        </nav>
        <button type="button" className="bottom-nav__add" aria-label="Add restaurant" onClick={onAdd}>
          <img src={navPlusIcon} alt="" aria-hidden="true" className="bottom-nav__add-inactive" />
          <img src={navPlusActiveIcon} alt="" aria-hidden="true" className="bottom-nav__add-active" />
        </button>
      </div>
    )
  }

  return (
    <div className="bottom-row">
      <nav className="bottom-nav" aria-label="Primary navigation">
        <div className="bottom-nav__items">
          <button
            type="button"
            className={`bottom-nav__item ${activeTab === 'map' ? 'is-active' : ''}`}
            aria-label="Map"
            aria-pressed={activeTab === 'map'}
            onClick={() => onChangeTab('map')}
          >
            <NavIcon active={navMapActiveIcon} inactive={navMapIcon} />
            <span>Map</span>
          </button>
          <button
            type="button"
            className={`bottom-nav__item ${activeTab === 'list' ? 'is-active' : ''}`}
            aria-label="List"
            aria-pressed={activeTab === 'list'}
            onClick={() => onChangeTab('list')}
          >
            <NavIcon active={navListActiveIcon} inactive={navListIcon} />
            <span>List</span>
          </button>
          <button
            type="button"
            className={`bottom-nav__item ${activeTab === 'explore' ? 'is-active' : ''}`}
            aria-label="Explore"
            aria-pressed={activeTab === 'explore'}
            onClick={() => onChangeTab('explore')}
          >
            <NavIcon active={navExploreActiveIcon} inactive={navExploreIcon} />
            <span>Explore</span>
          </button>
          <button
            type="button"
            className={`bottom-nav__item ${activeTab === 'my' ? 'is-active' : ''}`}
            aria-label="My"
            aria-pressed={activeTab === 'my'}
            onClick={() => onChangeTab('my')}
          >
            <NavIcon active={navMyActiveIcon} inactive={navMyIcon} />
            <span>My</span>
          </button>
        </div>
      </nav>
      <button type="button" className="bottom-nav__add" aria-label="Add restaurant" onClick={onAdd}>
        <img src={navPlusIcon} alt="" aria-hidden="true" className="bottom-nav__add-inactive" />
        <img src={navPlusActiveIcon} alt="" aria-hidden="true" className="bottom-nav__add-active" />
      </button>
    </div>
  )
}
