import { CloseIcon, CopyIcon, CheckIcon } from './Icons.js';

export const renderPromptViewModal = (container, props) => {
    const { prompt, onClose, onCopy } = props;

    if (!prompt) {
        container.innerHTML = '';
        return;
    }

    const originalCopyButtonContent = `${CopyIcon()}<span>Copy Text</span>`;
    const copiedButtonContent = `${CheckIcon()}<span>Copied!</span>`;

    container.innerHTML = `
    <div class="modal-overlay visible">
      <div class="modal-content">
        <div class="modal-header">
            <div class="prompt-view-modal-header">
                <div>
                    <h2 class="prompt-view-modal-title"></h2>
                    <span class="prompt-view-modal-category"></span>
                </div>
            </div>
            <button class="modal-close-btn">${CloseIcon()}</button>
        </div>
        <div class="prompt-view-modal-body">
            <textarea class="prompt-view-modal-text" readonly></textarea>
        </div>
        <div class="prompt-view-modal-actions">
            <button id="close-view-btn" class="btn" style="background-color: var(--btn-secondary-bg); margin-right: 0.75rem;">Close</button>
            <button id="copy-view-btn" class="btn btn-primary">
                ${originalCopyButtonContent}
            </button>
        </div>
      </div>
    </div>
    `;
    
    container.querySelector('.prompt-view-modal-title').textContent = prompt.title;
    container.querySelector('.prompt-view-modal-category').textContent = prompt.category;
    
    const textarea = container.querySelector('.prompt-view-modal-text');
    textarea.value = prompt.text;

    container.querySelector('.modal-close-btn').addEventListener('click', onClose);
    container.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) onClose();
    });
    container.querySelector('#close-view-btn').addEventListener('click', onClose);
    
    const copyBtn = container.querySelector('#copy-view-btn');
    copyBtn.addEventListener('click', () => {
        onCopy(prompt.text);
        copyBtn.innerHTML = copiedButtonContent;
        copyBtn.style.backgroundColor = 'var(--green-500)';

        setTimeout(() => {
            copyBtn.innerHTML = originalCopyButtonContent;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    });
};