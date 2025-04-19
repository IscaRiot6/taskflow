// ConfirmModal.js
import '../styles/ConfirmDeleteModal.css'

const ConfirmDeleteModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className='modal-backdrop'>
      <div className='modal-content'>
        <button
          className='modal-close'
          onClick={onCancel}
          aria-label='Close modal'
        >
          &times;
        </button>

        <p>{message}</p>
        <div className='modal-buttons'>
          <button className='modal-confirm' onClick={onConfirm}>
            Yes, delete
          </button>
          <button className='modal-cancel' onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal
