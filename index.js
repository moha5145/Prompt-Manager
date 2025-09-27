import App from './App.js';
import { init as initI18n } from './lib/i18n.js';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const storage = {
  get: (keys) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return chrome.storage.local.get(keys);
    }
    const result = {};
    const keyArray = Array.isArray(keys) ? keys : [keys];
    keyArray.forEach(key => {
        const data = localStorage.getItem(key);
        result[key] = data ? JSON.parse(data) : undefined;
    });
    return Promise.resolve(result);
  },
  set: (data) => {
     if (typeof chrome !== 'undefined' && chrome.storage) {
      return chrome.storage.local.set(data);
    }
    Object.keys(data).forEach(key => {
        localStorage.setItem(key, JSON.stringify(data[key]));
    });
    return Promise.resolve();
  }
};

const initializeResize = async () => {
    const targetElement = document.documentElement;
    const MAX_WIDTH = 790;
    const MAX_HEIGHT = 600;

    const savedSize = await storage.get(['windowWidth', 'windowHeight']);
    if (savedSize.windowWidth && savedSize.windowHeight) {
        targetElement.style.width = `${Math.min(savedSize.windowWidth, MAX_WIDTH)}px`;
        targetElement.style.height = `${Math.min(savedSize.windowHeight, MAX_HEIGHT)}px`;
    }

    const resizeHandle = document.getElementById('resize-handle');
    if (!resizeHandle) return;

    resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = parseInt(document.defaultView.getComputedStyle(targetElement).width, 10);
        const startHeight = parseInt(document.defaultView.getComputedStyle(targetElement).height, 10);
        
        const minWidth = parseInt(document.defaultView.getComputedStyle(targetElement).minWidth, 10);
        const minHeight = parseInt(document.defaultView.getComputedStyle(targetElement).minHeight, 10);

        const openTabBtn = document.getElementById('open-tab-btn');

        const doDrag = (e) => {
            const newWidth = startWidth + e.clientX - startX;
            const newHeight = startHeight + e.clientY - startY;

            if (openTabBtn) {
                if (newWidth >= MAX_WIDTH - 2 || newHeight >= MAX_HEIGHT - 2) {
                    openTabBtn.classList.add('highlight-pulse');
                } else {
                    openTabBtn.classList.remove('highlight-pulse');
                }
            }

            const constrainedWidth = Math.max(minWidth, Math.min(newWidth, MAX_WIDTH));
            const constrainedHeight = Math.max(minHeight, Math.min(newHeight, MAX_HEIGHT));

            targetElement.style.width = `${constrainedWidth}px`;
            targetElement.style.height = `${constrainedHeight}px`;
        };

        const stopDrag = () => {
            const finalWidth = parseInt(targetElement.style.width, 10);
            const finalHeight = parseInt(targetElement.style.height, 10);
            storage.set({ windowWidth: finalWidth, windowHeight: finalHeight });

            if (openTabBtn) {
                openTabBtn.classList.remove('highlight-pulse');
            }

            document.documentElement.removeEventListener('mousemove', doDrag, false);
            document.documentElement.removeEventListener('mouseup', stopDrag, false);
        };

        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
    });
};

const startApp = async () => {
    await initI18n();
    initializeResize();
    App(rootElement);
};

startApp();