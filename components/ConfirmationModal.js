import { TrashIcon } from './Icons.js';
import { t } from '../lib/i18n.js';

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
            <h3 class="modal-title">${t('confirmDeleteTitle')}</h3>
            <p class="modal-confirm-text"></p>
        </div>
        <div class="modal-confirm-actions">
            <button id="cancel-delete-btn" class="btn">${t('cancel')}</button>
            <button id="confirm-delete-btn" class="btn btn-delete-confirm">${t('delete')}</button>
        </div>
      </div>
    </div>
  `;
    
  container.querySelector('.modal-confirm-text').textContent = t('confirmDeleteMessage', { title: prompt.title });
  
  container.querySelector('#cancel-delete-btn').addEventListener('click', onCancel);
  container.querySelector('#confirm-delete-btn').addEventListener('click', onConfirm);
  
  container.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  });
};