import closeIcon from '../assets/icons/ico-close-xs.svg'
import './ConfirmationModal.css'

type ConfirmationModalProps = {
  open: boolean
  message: string
  confirmLabel: string
  closeLabel?: string
  hideCloseButton?: boolean
  secondaryLabel?: string
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmationModal({
  open,
  message,
  confirmLabel,
  closeLabel,
  hideCloseButton = false,
  secondaryLabel,
  onConfirm,
  onClose,
}: ConfirmationModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="confirmation-modal__backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="confirmation-modal"
        role="dialog"
        aria-modal="true"
        aria-label={message.replace(/\n/g, ' ')}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {!hideCloseButton && closeLabel && (
          <button type="button" className="confirmation-modal__close" aria-label={closeLabel} onClick={onClose}>
            <img src={closeIcon} alt="" aria-hidden="true" />
          </button>
        )}

        <p className="confirmation-modal__message">{message}</p>

        {secondaryLabel ? (
          <div className="confirmation-modal__actions confirmation-modal__actions--split">
            <button type="button" className="confirmation-modal__secondary" onClick={onClose}>
              {secondaryLabel}
            </button>
            <button type="button" className="confirmation-modal__confirm" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        ) : (
          <button type="button" className="confirmation-modal__confirm" onClick={onConfirm}>
            {confirmLabel}
          </button>
        )}
      </section>
    </div>
  )
}
