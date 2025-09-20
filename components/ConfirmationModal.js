import { TrashIcon } from './Icons.js';

export const renderConfirmationModal = (container, props) => {
  const { prompt, onConfirm, onCancel } = props;

  if (!prompt) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="modal-overlay visible">
      <div class="modal-content modal-confirm">
        <div class="modal-confirm-icon">
          ${TrashIcon()}
        </div>
        <div class="modal-confirm-content">
            <h3 class="modal-title">Delete Prompt</h3>
            <p class="modal-confirm-text">Are you sure you want to delete the prompt titled "<strong></strong>"? This action cannot be undone.</p>
        </div>
        <div class="modal-confirm-actions">
            <button id="cancel-delete-btn" class="btn">Cancel</button>
            <button id="confirm-delete-btn" class="btn btn-delete-confirm">Delete</button>
        </div>
      </div>
    </div>
  `;
    
  container.querySelector('.modal-confirm-text strong').textContent = prompt.title;
  
  container.querySelector('#cancel-delete-btn').addEventListener('click', onCancel);
  container.querySelector('#confirm-delete-btn').addEventListener('click', onConfirm);
  
  container.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  });
};
