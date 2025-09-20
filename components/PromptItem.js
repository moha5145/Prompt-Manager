import { CopyIcon, EditIcon, TrashIcon, CheckIcon } from './Icons.js';

export const renderPromptItem = (container, props) => {
  const { prompt, onEdit, onCopy, onInitiateDelete, onView } = props;

  const originalCopyIcon = CopyIcon();
  const copiedIcon = CheckIcon();

  const actionsHtml = `
      <button title="Copy Prompt" class="copy-btn">
        ${originalCopyIcon}
      </button>
      <button title="Edit Prompt" class="edit-btn">${EditIcon()}</button>
      <button title="Delete Prompt" class="delete-btn">${TrashIcon()}</button>
    `;

  container.className = 'prompt-item';
  container.innerHTML = `
    <div class="prompt-item-header">
      <h3 class="prompt-item-title"></h3>
      <div class="prompt-item-actions">
        ${actionsHtml}
      </div>
    </div>
    <p class="prompt-item-text"></p>
    <div class="prompt-item-footer">
        <span class="prompt-item-category"></span>
    </div>
  `;

  // Use textContent to prevent XSS
  container.querySelector('.prompt-item-title').textContent = prompt.title;
  container.querySelector('.prompt-item-text').textContent = prompt.text;
  container.querySelector('.prompt-item-category').textContent = prompt.category;

  const copyBtn = container.querySelector('.copy-btn');
  copyBtn?.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent the view modal from opening
    onCopy(prompt.text);
    copyBtn.innerHTML = copiedIcon;
    copyBtn.style.color = 'var(--green-400)';
    setTimeout(() => {
        copyBtn.innerHTML = originalCopyIcon;
        copyBtn.style.color = '';
    }, 2000);
  });
  
  container.querySelector('.edit-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    onEdit(prompt);
  });
  container.querySelector('.delete-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    onInitiateDelete(prompt);
  });

  container.addEventListener('click', (e) => {
    // Don't trigger view modal if an action button or its child was clicked
    if (e.target.closest('.prompt-item-actions')) {
      return;
    }
    onView(prompt);
  });
};