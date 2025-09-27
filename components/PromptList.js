import { renderPromptItem } from './PromptItem.js';
import { SearchIcon } from './Icons.js';
import { t } from '../lib/i18n.js';

const renderCategoryFilters = (props) => {
    const { categories, selectedCategory, onSelectCategory } = props;
    
    const controlsContainer = document.querySelector('.main-view-controls');
    // Clear old filters before rendering new ones
    const oldFilters = controlsContainer.querySelector('.category-filters');
    if (oldFilters) oldFilters.remove();

    if (categories.length <= 1) { // Only "All"
        return;
    }
    
    const filtersHtml = categories.map(category => `
        <button class="category-filter-btn ${category === selectedCategory ? 'active' : ''}" data-category="${category}">
            ${category}
        </button>
    `).join('');
    
    const filterContainer = document.createElement('div');
    filterContainer.className = 'category-filters';
    filterContainer.innerHTML = filtersHtml;
    
    controlsContainer.appendChild(filterContainer);

    filterContainer.addEventListener('click', e => {
        const target = e.target.closest('.category-filter-btn');
        if (target) {
            onSelectCategory(target.dataset.category);
        }
    });
};


export const renderPromptList = (container, props) => {
  const { 
    prompts, onEdit, onCopy, totalPromptsCount, searchQuery, onInitiateDelete, 
    categories, selectedCategory, onSelectCategory, onView
  } = props;
  
  renderCategoryFilters({ categories, selectedCategory, onSelectCategory });

  if (totalPromptsCount === 0) {
    container.innerHTML = `
      <div class="prompt-list-empty">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2>${t('noPromptsYet')}</h2>
        <p>${t('noPromptsYetDesc')}</p>
      </div>
    `;
    return;
  }
  
  if (prompts.length === 0) {
    container.innerHTML = `
      <div class="prompt-list-empty">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h2>${t('noResultsFound')}</h2>
        <p>${t('noResultsFoundDesc', { query: searchQuery })}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `<div class="prompt-list"></div>`;
  const listElement = container.querySelector('.prompt-list');
  
  prompts.forEach(prompt => {
    const promptElement = document.createElement('div');
    listElement.appendChild(promptElement);
    renderPromptItem(promptElement, { 
        prompt, 
        onEdit, 
        onCopy, 
        onInitiateDelete,
        onView,
    });
  });
};