import { useEffect } from 'react'
import closeIcon from '../assets/icons/ico-close-xs.svg'
import shareLinkIcon from '../assets/icons/ico-context-share.svg'
import peopleIcon from '../assets/icons/icon-peoples.svg'
import memberAvatarImage from '../assets/dummy/thumb-user.jpg'
import memberAvatarImageAlt from '../assets/dummy/thumb-user-2.jpg'
import { type LovedListItem } from './LovedListDetailPage'
import { ConfirmationModal } from './ConfirmationModal'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './ListCollaborationSheet.css'
import './ExplorePage.css'

type CollaborationMember = {
  id: string
  name: string
  image: string
}

type ListCollaborationSheetProps = {
  open: boolean
  listItem: LovedListItem
  onClose: () => void
}

const members: CollaborationMember[] = [
  { id: 'owner', name: 'Olivia(Owner)', image: memberAvatarImage },
  { id: 'emma', name: 'Emma', image: memberAvatarImageAlt },
]

export function ListCollaborationSheet({ open, listItem, onClose }: ListCollaborationSheetProps) {
  const { t } = useTranslation()
  const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false)
  const [pendingRemoveMemberId, setPendingRemoveMemberId] = useState<string | null>(null)

  if (!open) {
    return null
  }

  return (
    <div className="list-collaboration-sheet" role="presentation">
      <button type="button" className="list-collaboration-sheet__backdrop" aria-label={t('shared.close')} onClick={onClose} />

      <section className="list-collaboration-sheet__panel" role="dialog" aria-modal="true" aria-label={t('list.collaboration')}>
        <header className="list-collaboration-sheet__header screen-header">
          <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />
          <div className="screen-header__slot screen-header__slot--empty" aria-hidden="true" />
          <div className="screen-header__slot screen-header__slot--auto">
            <button type="button" className="screen-header__button" aria-label={t('shared.close')} onClick={onClose}>
              <img src={closeIcon} alt="" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="list-collaboration-sheet__body">
          <section className="list-collaboration-sheet__hero" aria-label={listItem.title}>
            <div className="list-collaboration-sheet__hero-card">
              <img className="list-collaboration-sheet__cover" src={listItem.image} alt="" aria-hidden="true" />
              <span className="list-collaboration-sheet__count">{listItem.count}</span>
            </div>
            <div className="list-collaboration-sheet__title-block">
              <h1 className="list-collaboration-sheet__title">{listItem.title}</h1>
              <p className="list-collaboration-sheet__owner">{listItem.owner}</p>
            </div>
          </section>

          <button type="button" className="list-collaboration-sheet__invite" aria-label={t('list.shareInviteLink')}>
            <span className="list-collaboration-sheet__invite-icon" aria-hidden="true">
              <img src={shareLinkIcon} alt="" aria-hidden="true" />
            </span>
            <span>{t('list.shareInviteLink')}</span>
          </button>

          <section className="list-collaboration-sheet__card" aria-label={t('list.collaboration')}>
            <header className="list-collaboration-sheet__section-header">
              <div className="list-collaboration-sheet__section-title">
                <span className="list-collaboration-sheet__section-icon" aria-hidden="true">
                  <img src={peopleIcon} alt="" aria-hidden="true" />
                </span>
                <span>{t('list.collaboration')}</span>
              </div>
            </header>

            <div className="list-collaboration-sheet__members">
              {members.map((member) => (
                <div className="list-collaboration-sheet__member" key={member.id}>
                  <img className="list-collaboration-sheet__member-avatar" src={member.image} alt="" aria-hidden="true" />
                  <span className="list-collaboration-sheet__member-name">{member.name}</span>
                  {member.id !== 'owner' && (
                    <button
                      type="button"
                      className="list-collaboration-sheet__member-remove"
                      aria-label={t('list.removeCollaborator', { name: member.name })}
                      onClick={() => {
                        setPendingRemoveMemberId(member.id)
                        setIsRemoveMemberOpen(true)
                      }}
                    >
                      <span aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <ConfirmationModal
        open={isRemoveMemberOpen}
        message={t('list.removeCollaboratorConfirm')}
        confirmLabel={t('shared.confirm')}
        closeLabel={t('shared.close')}
        onConfirm={() => {
          void pendingRemoveMemberId
          setPendingRemoveMemberId(null)
          setIsRemoveMemberOpen(false)
        }}
        onClose={() => {
          void pendingRemoveMemberId
          setPendingRemoveMemberId(null)
          setIsRemoveMemberOpen(false)
        }}
      />
    </div>
  )
}
