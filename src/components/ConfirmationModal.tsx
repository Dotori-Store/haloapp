import closeIcon from '../assets/icons/ico-close-xs.svg'
import './ConfirmationModal.css'

type ConfirmationModalProps = {
  open: boolean
  message: string
  confirmLabel: string
  closeLabel: string
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmationModal({
  open,
  message,
  confirmLabel,
  closeLabel,
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
        <button type="button" className="confirmation-modal__close" aria-label={closeLabel} onClick={onClose}>
          <img src={closeIcon} alt="" aria-hidden="true" />
        </button>

        <p className="confirmation-modal__message">{message}</p>

        <button type="button" className="confirmation-modal__confirm" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </section>
    </div>
  )
}
