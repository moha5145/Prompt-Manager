let notificationTimeoutId = null;

export const showNotification = (message, type = 'success', options = {}) => {
  const { duration = 4000, actionText, onAction, onTimeout } = options;
  const container = document.getElementById('notification-container') || document.body;

  if (notificationTimeoutId) {
    clearTimeout(notificationTimeoutId);
  }

  const existingNotification = container.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notificationElement = document.createElement('div');
  notificationElement.className = `notification ${type}`;
  
  let actionButtonHtml = '';
  if (actionText && onAction) {
    actionButtonHtml = `<button class="notification-action">${actionText}</button>`;
  }

  notificationElement.innerHTML = `
    <span class="notification-message">${message}</span>
    ${actionButtonHtml}
  `;
  
  container.appendChild(notificationElement);

  const hideAndRemove = () => {
    notificationElement.classList.remove('visible');
    notificationElement.addEventListener('transitionend', () => {
      if (notificationElement.parentElement) {
        notificationElement.remove();
      }
    });
    notificationTimeoutId = null;
  };
  
  if (actionText && onAction) {
    const actionButton = notificationElement.querySelector('.notification-action');
    actionButton.addEventListener('click', () => {
        onAction();
        clearTimeout(notificationTimeoutId);
        hideAndRemove();
    });
  }

  setTimeout(() => {
    notificationElement.classList.add('visible');
  }, 10);

  notificationTimeoutId = window.setTimeout(() => {
    if (onTimeout) {
      onTimeout();
    }
    hideAndRemove();
  }, duration);
};
