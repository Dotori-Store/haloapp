import { useState } from 'react'
import alarmBellIcon from '../assets/icons/ico-alarm-bell.svg'
import settingIcon from '../assets/icons/ico-setting.svg'
import closeIcon from '../assets/icons/ico-close-xs.svg'
import prayerIcon from '../assets/icons/ico-prayer.png'
import qiblaIcon from '../assets/icons/ico-qibla.png'
import goldArrow from '../assets/icons/ico-arrow-gold.svg'
import peoplesIcon from '../assets/icons/icon-peoples.svg'
import backArrowIcon from '../assets/icons/ico-back-arrow.svg'
import topCheckIcon from '../assets/icons/ico-top-check.svg'
import grayCameraIcon from '../assets/icons/ico-gray-camera.svg'
import lockIcon from '../assets/icons/ico-lock-red.svg'
import arrowMoreIcon from '../assets/icons/ico-arrow-more_xs.svg'
import moreDotsIcon from '../assets/icons/ico-more-dots-lg.svg'
import contextShareIcon from '../assets/icons/ico-context-share.svg'
import contextReportIcon from '../assets/icons/ico-context-report.svg'
import noticeFollowIcon from '../assets/icons/ico-notice-follow.svg'
import noticeHeartIcon from '../assets/icons/ico-notice-heart.svg'
import noticeKeepIcon from '../assets/icons/ico-notice-keep.svg'
import profileImage from '../assets/dummy/thumb-user.jpg'
import profileImageAlt from '../assets/dummy/thumb-user-2.jpg'
import sunnyMoodCover from '../assets/dummy/photo-cover.jpg'
import haloCheckCover from '../assets/images/album-cover-like.png'
import { LovedListDetailPage, type LovedListItem } from './LovedListDetailPage'
import './ExplorePage.css'
import './MyPage.css'

const prayerTimes = [
  { name: 'Fajr', time: '03:32' },
  { name: 'Sunrise', time: '03:32' },
  { name: 'Dhuhr', time: '03:32' },
  { name: 'Asr', time: '03:32' },
  { name: 'Maghrib', time: '03:32' },
  { name: 'Isha', time: '03:32', active: true },
]

const shareLists = [
  { id: 'sunny', title: 'Sunny mood', date: '2025-11-12', image: sunnyMoodCover, locked: true },
  { id: 'halo', title: 'halo check', date: '2025-11-08', image: haloCheckCover, locked: false },
]

type ProfileUser = {
  id: string
  name: string
  image: string
}

type NoticeItem = {
  id: string
  title: string
  description: string
  time: string
  icon: string
  read: boolean
}

const followingUsers = [
  { id: 'david', name: 'David', image: profileImage },
  { id: 'emma', name: 'Emma', image: profileImageAlt },
  { id: 'olivia', name: 'Olivia', image: profileImage },
]

const followerUsers = [
  { id: 'david', name: 'David', image: profileImage },
  { id: 'olivia', name: 'Olivia', image: profileImageAlt },
  { id: 'emma', name: 'Emma', image: profileImage },
]

const otherProfileFollowers = [
  { id: 'david', name: 'David', image: profileImageAlt },
  { id: 'olivia', name: 'Olivia', image: profileImage },
  { id: 'emma', name: 'Emma', image: profileImageAlt },
]

const otherProfileFollowing = [
  { id: 'david', name: 'David', image: profileImage },
  { id: 'olivia', name: 'Olivia', image: profileImageAlt },
  { id: 'emma', name: 'Emma', image: profileImage },
  { id: 'tom', name: 'Tom', image: profileImageAlt },
]

const otherProfileLists: LovedListItem[] = [
  {
    id: 'user-list-1',
    title: 'Rainy day cafe',
    owner: 'Hassan',
    date: '2026.08.19',
    count: 8,
    image: sunnyMoodCover,
  },
  {
    id: 'user-list-2',
    title: 'halo check',
    owner: 'Hassan',
    date: '2026.08.19',
    count: 12,
    image: haloCheckCover,
  },
]

const noticeItems = [
  {
    id: 'like',
    title: 'Like',
    description: "Zo's liked the restaurant you registered.",
    time: '2hours',
    icon: noticeHeartIcon,
    read: false,
  },
  {
    id: 'follow',
    title: 'New Follower',
    description: 'Olivia followed you.',
    time: '1day',
    icon: noticeFollowIcon,
    read: false,
  },
  {
    id: 'keep',
    title: 'Add List',
    description: "Zo's liked the restaurant you registered.",
    time: '5hours',
    icon: noticeKeepIcon,
    read: false,
  },
] satisfies NoticeItem[]

type MyPageProps = {
  onReportIncorrect: () => void
  onAddToList: () => void
}

export function MyPage({ onReportIncorrect, onAddToList }: MyPageProps) {
  const [isPrayerExpanded, setIsPrayerExpanded] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [peoplePage, setPeoplePage] = useState<'follower' | 'following' | null>(null)
  const [selectedUser, setSelectedUser] = useState<ProfileUser | null>(null)
  const [selectedUserList, setSelectedUserList] = useState<LovedListItem | null>(null)
  const [isUserNetworkOpen, setIsUserNetworkOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isNoticeOpen, setIsNoticeOpen] = useState(false)
  const [language, setLanguage] = useState<'english' | 'korean'>('english')
  const [isNewContentNotificationOn, setIsNewContentNotificationOn] = useState(true)
  const [isActivityNotificationOn, setIsActivityNotificationOn] = useState(false)
  const [isMyPageExposed, setIsMyPageExposed] = useState(true)
  const [noticeReadMap, setNoticeReadMap] = useState<Record<string, boolean>>(
    () => Object.fromEntries(noticeItems.map((notice) => [notice.id, notice.read])) as Record<string, boolean>,
  )
  const allNoticesRead = noticeItems.every((notice) => noticeReadMap[notice.id])

  if (selectedUserList) {
    return (
      <LovedListDetailPage
        listItem={selectedUserList}
        onBack={() => setSelectedUserList(null)}
        onAddToList={onAddToList}
        onReportIncorrect={onReportIncorrect}
      />
    )
  }

  const openNoticeSheet = () => {
    setIsSettingsOpen(false)
    setIsNoticeOpen(true)
  }

  const markNoticeRead = (id: string) => {
    setNoticeReadMap((current) => (current[id] ? current : { ...current, [id]: true }))
  }

  const markAllNoticesRead = () => {
    setNoticeReadMap((current) => {
      const next = { ...current }
      noticeItems.forEach((notice) => {
        next[notice.id] = true
      })
      return next
    })
  }

  if (selectedUser) {
    if (isUserNetworkOpen) {
      return (
        <div className="my-page my-page--people">
          <header className="my-people__header screen-header">
            <div className="screen-header__slot">
              <button type="button" className="screen-header__button" aria-label="Back" onClick={() => setIsUserNetworkOpen(false)}>
                <img src={backArrowIcon} alt="" aria-hidden="true" />
              </button>
            </div>
            <div className="screen-header__title">
              <h1 className="head-title">{selectedUser.name}</h1>
            </div>
            <div className="screen-header__slot" aria-hidden="true" />
          </header>

          <main className="my-user-network__content">
            <section className="my-user-network__section" aria-label="Follower">
              <h2>Follower</h2>
              <div className="my-people__list">
                {otherProfileFollowers.map((user) => (
                  <button type="button" className="my-people__item" key={user.id}>
                    <img src={user.image} alt="" aria-hidden="true" className="my-people__avatar" />
                    <h3>{user.name}</h3>
                  </button>
                ))}
              </div>
            </section>

            <section className="my-user-network__section" aria-label="Following">
              <h2>Following</h2>
              <div className="my-people__list">
                {otherProfileFollowing.map((user) => (
                  <button type="button" className="my-people__item" key={user.id}>
                    <img src={user.image} alt="" aria-hidden="true" className="my-people__avatar" />
                    <h3>{user.name}</h3>
                  </button>
                ))}
              </div>
            </section>
          </main>
        </div>
      )
    }

    return (
      <div className="my-page my-page--user-profile">
        <header className="my-user-profile__header">
          <button type="button" className="screen-header__button" aria-label="Back" onClick={() => setSelectedUser(null)}>
            <img src={backArrowIcon} alt="" aria-hidden="true" />
          </button>
          <div className="my-user-profile__menu-wrap">
            <button
              type="button"
              className="screen-header__button"
              aria-label="More options"
              aria-expanded={isUserMenuOpen}
              onClick={() => setIsUserMenuOpen((current) => !current)}
            >
              <img src={moreDotsIcon} alt="" aria-hidden="true" />
            </button>
            {isUserMenuOpen && (
              <div className="my-user-profile__context" role="menu">
                <button type="button" role="menuitem">
                  <img src={contextShareIcon} alt="" aria-hidden="true" />
                  <span>Share profile</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="is-danger"
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    onReportIncorrect()
                  }}
                >
                  <img src={contextReportIcon} alt="" aria-hidden="true" />
                  <span>Report user</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="my-user-profile__content">
          <section className="my-user-profile__summary" aria-label={`${selectedUser.name} profile`}>
            <img src={selectedUser.image} alt="" aria-hidden="true" className="my-user-profile__avatar" />
            <h1>{selectedUser.name}</h1>
            <div className="my-user-profile__stats" aria-label="Profile stats">
              <button type="button" onClick={() => setIsUserNetworkOpen(true)}>Follower 2</button>
              <span className="text-dot" aria-hidden="true" />
              <button type="button" onClick={() => setIsUserNetworkOpen(true)}>Following 3</button>
            </div>
            <button type="button" className="my-user-profile__follow">follow</button>
          </section>

          <section className="my-user-profile__share-list" aria-label="Share List">
            <h2>Share List</h2>
            <div className="my-user-profile__album-grid">
              {otherProfileLists.map((listItem) => (
                <button
                  type="button"
                  className="my-user-profile__album"
                  key={listItem.id}
                  onClick={() => setSelectedUserList(listItem)}
                >
                  <div className="my-user-profile__album-media">
                    <img src={listItem.image} alt="" aria-hidden="true" />
                    <span>{listItem.count}</span>
                  </div>
                  <div className="my-user-profile__album-content">
                    <h3>{listItem.title}</h3>
                    <p>{listItem.date}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
    )
  }

  if (peoplePage) {
    const title = peoplePage === 'following' ? 'Following' : 'Follower'
    const users = peoplePage === 'following' ? followingUsers : followerUsers

    return (
      <div className="my-page my-page--people">
        <header className="my-people__header screen-header">
          <div className="screen-header__slot">
            <button type="button" className="screen-header__button" aria-label="Back" onClick={() => setPeoplePage(null)}>
              <img src={backArrowIcon} alt="" aria-hidden="true" />
            </button>
          </div>
          <div className="screen-header__title">
            <h1 className="head-title">{title}</h1>
          </div>
          <div className="screen-header__slot" aria-hidden="true" />
        </header>

        <main className="my-people__content">
          <section className="my-people__section" aria-label={title}>
            <h2>{title}</h2>
            <div className="my-people__list">
              {users.map((user) => (
                <button
                  type="button"
                  className="my-people__item"
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user)
                    setIsUserNetworkOpen(false)
                    setIsUserMenuOpen(false)
                  }}
                >
                  <div className="my-people__avatar-wrap">
                    <img src={user.image} alt="" aria-hidden="true" className="my-people__avatar" />
                    <span className="my-people__remove" aria-hidden="true" />
                  </div>
                  <h3>{user.name}</h3>
                </button>
              ))}
            </div>
          </section>

          {peoplePage === 'follower' && (
            <div className="my-people__exposure">
              <span>Exposure to My Page</span>
              <button
                type="button"
                className={`my-people__switch ${isMyPageExposed ? 'is-on' : ''}`}
                aria-label="Exposure to My Page"
                aria-pressed={isMyPageExposed}
                onClick={() => setIsMyPageExposed((current) => !current)}
              >
                <span />
              </button>
            </div>
          )}
        </main>
      </div>
    )
  }

  if (isEditOpen) {
    return (
      <div className="my-page my-page--edit">
        <header className="my-edit__header screen-header">
          <div className="screen-header__slot">
            <button type="button" className="screen-header__button" aria-label="Back" onClick={() => setIsEditOpen(false)}>
              <img src={backArrowIcon} alt="" aria-hidden="true" />
            </button>
          </div>
          <div className="screen-header__title">
            <h1 className="head-title">Edit</h1>
          </div>
          <div className="screen-header__slot">
            <button type="button" className="screen-header__button my-edit__confirm" aria-label="Save profile" onClick={() => setIsEditOpen(false)}>
              <img src={topCheckIcon} alt="" aria-hidden="true" />
            </button>
          </div>
        </header>

        <main className="my-edit__content">
          <button type="button" className="my-edit__photo" aria-label="Edit profile photo">
            <img src={grayCameraIcon} alt="" aria-hidden="true" />
          </button>

          <div className="my-edit__rows">
            <div className="my-edit__row">
              <span>Name</span>
              <span>Khadija</span>
            </div>
            <div className="my-edit__row">
              <span>Exposure to My Page</span>
              <button
                type="button"
                className={`my-edit__switch ${isMyPageExposed ? 'is-on' : ''}`}
                aria-label="Exposure to My Page"
                aria-pressed={isMyPageExposed}
                onClick={() => setIsMyPageExposed((current) => !current)}
              >
                <span />
              </button>
            </div>
          </div>

          <section className="my-edit__share-list" aria-label="Share List">
            <h2>Share List</h2>
            <div className="my-edit__album-grid">
              {shareLists.map((listItem) => (
                <article className="my-edit__album" key={listItem.id}>
                  <div className="my-edit__album-media">
                    <img src={listItem.image} alt="" aria-hidden="true" />
                    {listItem.locked && (
                      <span className="my-edit__album-lock" aria-hidden="true">
                        <img src={lockIcon} alt="" aria-hidden="true" />
                      </span>
                    )}
                  </div>
                  <div className="my-edit__album-content">
                    <h3>{listItem.title}</h3>
                    <p>{listItem.date}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="my-page">
      <header className="my-page__header">
        <h1 className="page-title">My</h1>
        <div className="my-page__header-actions">
          <button type="button" className="my-page__icon-button my-page__alarm" aria-label="Notifications" onClick={openNoticeSheet}>
            <img src={alarmBellIcon} alt="" aria-hidden="true" />
          </button>
          <button type="button" className="my-page__icon-button" aria-label="Settings" onClick={() => setIsSettingsOpen(true)}>
            <img src={settingIcon} alt="" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="my-page__content">
        <section className="my-page__profile" aria-label="Profile">
          <img src={profileImage} alt="" aria-hidden="true" className="my-page__avatar" />
          <h2>Khadija</h2>
          <div className="my-page__stats" aria-label="Profile stats">
            <button type="button" onClick={() => setPeoplePage('follower')}>Follower 2</button>
            <span className="text-dot" aria-hidden="true" />
            <button type="button" onClick={() => setPeoplePage('following')}>Following 32</button>
          </div>
          <button type="button" className="my-page__edit" onClick={() => setIsEditOpen(true)}>edit</button>
        </section>

        <section className={`my-page__prayer ${isPrayerExpanded ? 'is-expanded' : ''}`} aria-label="Prayer time">
          <header className="my-page__prayer-header">
            <div className="my-page__prayer-label">
              <img src={prayerIcon} alt="" aria-hidden="true" className="my-page__prayer-icon" />
              <span>Prayer time</span>
            </div>
            <time dateTime="2026-07-14">2026.07.14</time>
          </header>

          <div className="my-page__next-prayer">
            <span>Next</span>
            <strong>Isha</strong>
            <time dateTime="21:36">21:36</time>
          </div>

          {isPrayerExpanded && (
            <div className="my-page__prayer-list">
              {prayerTimes.map((item) => (
                <div className={item.active ? 'is-active' : ''} key={item.name}>
                  <span>{item.name}</span>
                  <time dateTime={item.time}>{item.time}</time>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            className="my-page__expand"
            aria-expanded={isPrayerExpanded}
            onClick={() => setIsPrayerExpanded((current) => !current)}
          >
            <span className="my-page__chevron" aria-hidden="true" />
            <span>{isPrayerExpanded ? 'Collapse' : 'Expand'}</span>
          </button>
        </section>

        <button type="button" className="my-page__qibla">
          <span className="my-page__qibla-copy">
            <span className="my-page__qibla-icon">
              <img src={qiblaIcon} alt="" aria-hidden="true" />
            </span>
            <span>Qibla Direction</span>
          </span>
          <img src={goldArrow} alt="" aria-hidden="true" className="my-page__qibla-arrow" />
        </button>

        <button type="button" className="my-page__find-users">
          <img src={peoplesIcon} alt="" aria-hidden="true" />
          <span>Find more users</span>
        </button>
      </main>

      {isSettingsOpen && (
        <div className="my-settings-sheet" role="presentation" onMouseDown={() => setIsSettingsOpen(false)}>
          <section
            className="my-settings-sheet__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="my-settings-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="my-settings-sheet__header">
              <h2 id="my-settings-title" className="page-title">Settings</h2>
              <button type="button" className="my-settings-sheet__close" aria-label="Close settings" onClick={() => setIsSettingsOpen(false)}>
                <img src={closeIcon} alt="" aria-hidden="true" />
              </button>
            </header>

            <div className="my-settings-sheet__content">
              <div className="my-settings-sheet__row">
                <span>Language Settings</span>
                <div
                  className={`my-settings-sheet__language ${language === 'korean' ? 'is-korean' : ''}`}
                  role="group"
                  aria-label="Language Settings"
                >
                  <button
                    type="button"
                    className={language === 'english' ? 'is-active' : ''}
                    aria-pressed={language === 'english'}
                    onClick={() => setLanguage('english')}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    className={language === 'korean' ? 'is-active' : ''}
                    aria-pressed={language === 'korean'}
                    onClick={() => setLanguage('korean')}
                  >
                    Korean
                  </button>
                </div>
              </div>

              <section className="my-settings-sheet__section" aria-label="Notification settings">
                <h3>Notification settings</h3>
                <div className="my-settings-sheet__row">
                  <span>New content notifications</span>
                  <button
                    type="button"
                    className={`my-settings-sheet__switch ${isNewContentNotificationOn ? 'is-on' : ''}`}
                    aria-label="New content notifications"
                    aria-pressed={isNewContentNotificationOn}
                    onClick={() => setIsNewContentNotificationOn((current) => !current)}
                  >
                    <span />
                  </button>
                </div>
                <div className="my-settings-sheet__row">
                  <span>Notifications about my activity</span>
                  <button
                    type="button"
                    className={`my-settings-sheet__switch ${isActivityNotificationOn ? 'is-on' : ''}`}
                    aria-label="Notifications about my activity"
                    aria-pressed={isActivityNotificationOn}
                    onClick={() => setIsActivityNotificationOn((current) => !current)}
                  >
                    <span />
                  </button>
                </div>
              </section>

              <button type="button" className="my-settings-sheet__privacy">
                <span>
                  <strong>Privacy and Terms and Conditions</strong>
                  <small>This application contains personal informati...</small>
                </span>
                <span aria-hidden="true" className="my-settings-sheet__privacy-arrow">
                  <img src={arrowMoreIcon} alt="" aria-hidden="true" />
                </span>
              </button>

              <div className="my-settings-sheet__footer">
                <button type="button" className="my-settings-sheet__logout">Logout</button>
                <button type="button" className="my-settings-sheet__withdrawal">Withdrawal of membership</button>
              </div>
            </div>
          </section>
        </div>
      )}

      {isNoticeOpen && (
        <div className="my-notice-sheet" role="presentation" onMouseDown={() => setIsNoticeOpen(false)}>
          <section
            className="my-notice-sheet__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="my-notice-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="my-notice-sheet__header">
              <h2 id="my-notice-title" className="page-title">Notice</h2>
              <button type="button" className="my-notice-sheet__close" aria-label="Close notice" onClick={() => setIsNoticeOpen(false)}>
                <img src={closeIcon} alt="" aria-hidden="true" />
              </button>
            </header>

            <div className="my-notice-sheet__content">
              <div className="my-notice-sheet__action-row">
                <button
                  type="button"
                  className={`my-notice-sheet__check-all ${allNoticesRead ? 'is-read' : ''}`}
                  onClick={markAllNoticesRead}
                  disabled={allNoticesRead}
                >
                  Check all
                </button>
              </div>

              <div className="my-notice-sheet__list" role="list" aria-label="Notice list">
                {noticeItems.map((notice) => {
                  const isRead = noticeReadMap[notice.id]

                  return (
                    <button
                      key={notice.id}
                      type="button"
                      className={`my-notice-sheet__item ${isRead ? 'is-read' : ''}`}
                      role="listitem"
                      onClick={() => markNoticeRead(notice.id)}
                    >
                      <span className="my-notice-sheet__icon">
                        <img src={notice.icon} alt="" aria-hidden="true" />
                      </span>
                      <span className="my-notice-sheet__copy">
                        <span className="my-notice-sheet__title-row">
                          <span className="my-notice-sheet__title">{notice.title}</span>
                        </span>
                        <span className="my-notice-sheet__description">{notice.description}</span>
                      </span>
                      <span className="my-notice-sheet__time">{notice.time}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
