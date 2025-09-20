import { getPrompts, addPrompt, updatePrompt, deletePrompt, importPrompts, getTemplates, addTemplate, deleteTemplate, callGeminiAPI, getApiKey, setApiKey } from './hooks/usePrompts.js';
import { renderPromptList } from './components/PromptList.js';
import { renderPromptForm } from './components/PromptForm.js';
import { renderConfirmationModal } from './components/ConfirmationModal.js';
import { renderPromptViewModal } from './components/PromptViewModal.js';
import { showNotification } from './components/Notification.js';
import { PlusIcon, SettingsIcon, SearchIcon, SortIcon, ExternalLinkIcon, TrashIcon, SparkleIcon, SpinnerIcon, BackIcon, EyeIcon, EyeOffIcon } from './components/Icons.js';

const renderSettingsView = (container, props) => {
    const { onExport, onImport, templates, onAddTemplate, onDeleteTemplate, apiKey, onSaveApiKey } = props;
    
    const templatesHtml = templates.map(template => `
        <li class="template-list-item" data-id="${template.id}">
            <span class="template-list-item-title">${template.title}</span>
            <button class="btn-icon delete-template-btn" title="Delete Template">${TrashIcon()}</button>
        </li>
    `).join('');

    container.innerHTML = `
        <div class="settings-view">
            <div class="api-key-management-section">
                <h2>API Key Management</h2>
                <p>
                    Your Gemini API key is required for AI features. Get your key from 
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>. 
                    It is stored securely in your browser's local storage.
                </p>
                <form id="api-key-form" class="settings-form">
                    <div class="form-group">
                        <label for="api-key-input">Gemini API Key</label>
                         <div class="input-with-icon">
                            <input id="api-key-input" type="password" class="form-input" placeholder="Enter your API key" value="${apiKey || ''}" />
                            <button type="button" id="toggle-api-key-visibility" class="input-icon-btn" title="Toggle visibility">
                                ${EyeIcon()}
                            </button>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Save Key</button>
                    </div>
                </form>
            </div>
        
            <div class="data-management-section">
                <h2>Data Management</h2>
                <p>Save your prompts to a file or load them from a backup.</p>
                <div class="data-management-actions">
                    <button id="export-btn" class="btn">Export Prompts</button>
                    <button id="import-btn" class="btn">Import Prompts</button>
                </div>
            </div>

            <div class="template-management-section">
                <h2>Prompt Templates</h2>
                <p>Create reusable templates to speed up prompt creation.</p>
                <form id="template-form" class="settings-form">
                    <div class="form-group">
                        <label for="template-title">Template Title</label>
                        <input id="template-title" type="text" class="form-input" placeholder="e.g., 'Persona Generator'" required />
                    </div>
                    <div class="form-group">
                        <label for="template-text">Template Text</label>
                        <div class="textarea-container">
                            <textarea id="template-text" rows="4" class="form-textarea" placeholder="e.g., 'Act as a {{role}} and describe...'" required></textarea>
                            <div class="ai-actions">
                                <button type="button" id="improve-template-btn" class="btn-ai" title="Improve with AI">
                                    ${SparkleIcon()} <span>Improve</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Save Template</button>
                    </div>
                </form>
                <h3 style="margin-top: 1.5rem; font-size: 1rem;">Saved Templates</h3>
                <ul id="template-list" style="margin-top: 1rem;">
                    ${templates.length > 0 ? templatesHtml : '<li>No templates saved yet.</li>'}
                </ul>
            </div>
        </div>
    `;

    // API Key form logic
    const apiKeyForm = container.querySelector('#api-key-form');
    const apiKeyInput = container.querySelector('#api-key-input');
    const toggleVisibilityBtn = container.querySelector('#toggle-api-key-visibility');

    apiKeyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        onSaveApiKey(apiKeyInput.value.trim());
    });

    toggleVisibilityBtn.addEventListener('click', () => {
        const isPassword = apiKeyInput.type === 'password';
        apiKeyInput.type = isPassword ? 'text' : 'password';
        toggleVisibilityBtn.innerHTML = isPassword ? EyeOffIcon() : EyeIcon();
    });

    // Template form logic
    const templateForm = container.querySelector('#template-form');
    const templateTextInput = container.querySelector('#template-text');
    const improveTemplateBtn = container.querySelector('#improve-template-btn');

    templateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleInput = container.querySelector('#template-title');
        const textInput = container.querySelector('#template-text');
        const title = titleInput.value.trim();
        const text = textInput.value.trim();
        if (title && text) {
            onAddTemplate({ title, text });
            titleInput.value = '';
            textInput.value = '';
        }
    });

    const updateTemplateButtonState = () => {
        const textIsEmpty = !templateTextInput.value.trim();
        improveTemplateBtn.disabled = textIsEmpty;
    };
    templateTextInput.addEventListener('input', updateTemplateButtonState);
    updateTemplateButtonState();

    improveTemplateBtn.addEventListener('click', async () => {
        const originalContent = improveTemplateBtn.innerHTML;
        const setProcessingState = (isProcessing) => {
            if (isProcessing) {
                improveTemplateBtn.innerHTML = `${SpinnerIcon()} Processing...`;
                improveTemplateBtn.disabled = true;
            } else {
                improveTemplateBtn.innerHTML = originalContent;
                updateTemplateButtonState();
            }
        };

        setProcessingState(true);
        try {
            const prompt = `Correct any spelling or grammar mistakes and improve the phrasing of the following text. Make it clearer, more concise, and more effective. Return only the improved text, without any additional explanations or introductory phrases.\n\nOriginal text:\n"${templateTextInput.value}"`;
            const resultText = await callGeminiAPI(prompt);
            templateTextInput.value = resultText;
            showNotification('Template improved with AI!', 'success');
        } catch (e) {
            console.error(e);
            showNotification(e.message || 'Failed to improve template.', 'error');
        } finally {
            setProcessingState(false);
        }
    });


    // Template list logic
    container.querySelector('#template-list').addEventListener('click', e => {
        const deleteBtn = e.target.closest('.delete-template-btn');
        if (deleteBtn) {
            const templateItem = e.target.closest('.template-list-item');
            const templateId = templateItem.dataset.id;
            onDeleteTemplate(templateId);
        }
    });

    // General listeners
    container.querySelector('#export-btn').addEventListener('click', onExport);
    container.querySelector('#import-btn').addEventListener('click', onImport);
};

const sortPrompts = (prompts, order) => {
    const sorted = [...prompts]; // Create a copy to avoid mutating state directly
    switch (order) {
      case 'date-asc':
        return sorted.sort((a, b) => a.id.localeCompare(b.id));
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title, undefined, { sensitivity: 'base' }));
      case 'category-asc':
        return sorted.sort((a, b) => a.category.localeCompare(b.category, undefined, { sensitivity: 'base' }));
      case 'category-desc':
        return sorted.sort((a, b) => b.category.localeCompare(a.category, undefined, { sensitivity: 'base' }));
      case 'date-desc':
      default:
        return sorted.sort((a, b) => b.id.localeCompare(a.id));
    }
};

const App = async (rootElement) => {
  let state = {
    prompts: [],
    templates: [],
    apiKey: '',
    isFormVisible: false,
    editingPrompt: null,
    currentView: 'main', // 'main' or 'settings'
    searchQuery: '',
    selectedCategory: 'All',
    sortOrder: 'date-desc',
    promptToDelete: null,
    viewingPrompt: null,
    lastDeletedPrompt: null,
  };

  const setState = (newState) => {
    Object.assign(state, newState);
    render();
  };

  // FORM HANDLERS
  const handleOpenAddForm = () => setState({ editingPrompt: null, isFormVisible: true });
  const handleOpenEditForm = (prompt) => setState({ editingPrompt: prompt, isFormVisible: true });
  const handleCloseForm = () => setState({ isFormVisible: false, editingPrompt: null });

  // MODAL HANDLERS
  const handleOpenViewModal = (prompt) => setState({ viewingPrompt: prompt });
  const handleCloseViewModal = () => setState({ viewingPrompt: null });

  // SETTINGS HANDLERS
  const handleOpenSettings = () => setState({ currentView: 'settings' });
  const handleCloseSettings = () => setState({ currentView: 'main' });
  
  // DATA HANDLERS
  const handleExport = () => {
    if (state.prompts.length === 0) {
        showNotification("No prompts to export.", "info");
        return;
    }
    const promptsJson = JSON.stringify(state.prompts, null, 2);
    const blob = new Blob([promptsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompts.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Prompts exported successfully!', 'success');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                const { mergedPrompts, importedCount } = await importPrompts(importedData);
                setState({ prompts: mergedPrompts });
                if (importedCount > 0) {
                    showNotification(`${importedCount} new prompt(s) imported successfully!`, 'success');
                } else {
                    showNotification("No new prompts were found to import.", "info");
                }
            } catch (err) {
                console.error("Import failed:", err);
                showNotification('Failed to import prompts. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
  };

  // PROMPT HANDLERS
  const handleSavePrompt = async (data) => {
    let updatedPrompts;
    if (state.editingPrompt) {
      const updated = { ...state.editingPrompt, ...data };
      await updatePrompt(updated);
      updatedPrompts = state.prompts.map(p => p.id === updated.id ? updated : p);
      showNotification('Prompt updated successfully!');
    } else {
      const newPrompt = await addPrompt(data);
      updatedPrompts = [...state.prompts, newPrompt];
      showNotification('Prompt added successfully!');
    }
    setState({ prompts: updatedPrompts });
    handleCloseForm();
  };

  const handleInitiateDelete = (prompt) => {
    setState({ promptToDelete: prompt });
  };
  
  const handleCancelDelete = () => {
    setState({ promptToDelete: null });
  };
  
  const handleConfirmDelete = async () => {
    const promptToDelete = state.promptToDelete;
    if (!promptToDelete) return;

    const updatedPrompts = state.prompts.filter(p => p.id !== promptToDelete.id);
    
    setState({
      prompts: updatedPrompts,
      promptToDelete: null,
      lastDeletedPrompt: promptToDelete
    });

    showNotification('Prompt deleted.', 'info', {
        actionText: 'Undo',
        onAction: handleUndoDelete,
        onTimeout: handleFinalizeDelete,
        duration: 5000,
    });
  };

  const handleUndoDelete = () => {
    const promptToRestore = state.lastDeletedPrompt;
    if (!promptToRestore) return;
    
    const restoredPrompts = [...state.prompts, promptToRestore];
    
    setState({
        prompts: restoredPrompts,
        lastDeletedPrompt: null
    });
  };

  const handleFinalizeDelete = async () => {
    const promptToDelete = state.lastDeletedPrompt;
    if (!promptToDelete) return;

    await deletePrompt(promptToDelete.id);
    setState({ lastDeletedPrompt: null });
  };

  const handleCopyPrompt = (text) => {
    navigator.clipboard.writeText(text);
    // Notification is handled inside the component for better UX
  };
  
  // TEMPLATE HANDLERS
  const handleAddTemplate = async (templateData) => {
    const newTemplate = await addTemplate(templateData);
    setState({ templates: [...state.templates, newTemplate] });
    showNotification('Template saved successfully!', 'success');
  };

  const handleDeleteTemplate = async (templateId) => {
    await deleteTemplate(templateId);
    setState({ templates: state.templates.filter(t => t.id !== templateId) });
    showNotification('Template deleted.', 'info');
  };
  
  // API KEY HANDLER
  const handleSaveApiKey = async (key) => {
    await setApiKey(key);
    setState({ apiKey: key });
    showNotification('API Key saved successfully!', 'success');
  };

  // FILTERING & SORTING HANDLERS
  const handleSearchChange = (e) => {
    state.searchQuery = e.target.value;
    render();
  };
  
  const handleSelectCategory = (category) => {
    setState({ selectedCategory: category });
  };
  
  const handleSortChange = (e) => {
    setState({ sortOrder: e.target.value });
  };

  // RENDER LOGIC
  const render = () => {
    if (!rootElement.querySelector('.app-container')) {
      rootElement.innerHTML = `
        <div class="app-container">
          <header>
            <h1>Prompt Manager</h1>
            <div class="header-actions">
              <button id="add-prompt-btn" class="btn btn-primary">
                ${PlusIcon()}
                <span>New</span>
              </button>
              <button id="open-tab-btn" title="Open in new tab" class="btn-icon">
                ${ExternalLinkIcon()}
              </button>
              <button id="settings-btn" title="Settings" class="btn-icon">
                ${SettingsIcon()}
              </button>
            </div>
          </header>
          <div id="main-view-controls"></div>
          <main id="main-content"></main>
        </div>
        <div id="form-container"></div>
      `;
      const headerActions = rootElement.querySelector('.header-actions');
      headerActions.addEventListener('click', (e) => {
          const addBtn = e.target.closest('#add-prompt-btn');
          if (addBtn) return handleOpenAddForm();
          
          const settingsBtn = e.target.closest('#settings-btn');
          if (settingsBtn) return handleOpenSettings();
          
          const backBtn = e.target.closest('#back-btn');
          if (backBtn) return handleCloseSettings();

          const openTabBtn = e.target.closest('#open-tab-btn');
          if (openTabBtn) {
              if (typeof chrome !== 'undefined' && chrome.tabs) {
                  chrome.tabs.create({ url: 'index.html' });
              }
              return;
          }
      });
    }

    const header = rootElement.querySelector('header');
    const headerTitle = header.querySelector('h1');
    const headerActions = header.querySelector('.header-actions');
    const mainContent = rootElement.querySelector('#main-content');
    const mainViewControls = rootElement.querySelector('#main-view-controls');
    const formContainer = rootElement.querySelector('#form-container');
    const confirmationModalContainer = document.getElementById('confirmation-modal-container');
    const promptViewModalContainer = document.getElementById('prompt-view-modal-container');
    
    const categories = ['All', ...[...new Set(state.prompts.map(p => p.category))].sort()];

    if (state.currentView === 'settings') {
        headerTitle.textContent = 'Settings';
        headerActions.innerHTML = `
            <button id="back-btn" class="btn" style="background-color: var(--btn-secondary-bg); gap: 0.5rem;">
                ${BackIcon()}
                <span>Back</span>
            </button>
        `;
        mainViewControls.innerHTML = ''; 
        renderSettingsView(mainContent, {
            onExport: handleExport,
            onImport: handleImport,
            templates: state.templates,
            onAddTemplate: handleAddTemplate,
            onDeleteTemplate: handleDeleteTemplate,
            apiKey: state.apiKey,
            onSaveApiKey: handleSaveApiKey,
        });
    } else {
        if (headerTitle.textContent !== 'Prompt Manager') {
            headerTitle.textContent = 'Prompt Manager';
            headerActions.innerHTML = `
                <button id="add-prompt-btn" class="btn btn-primary">
                    ${PlusIcon()}
                    <span>New</span>
                </button>
                <button id="open-tab-btn" title="Open in new tab" class="btn-icon">
                    ${ExternalLinkIcon()}
                </button>
                <button id="settings-btn" title="Settings" class="btn-icon">
                    ${SettingsIcon()}
                </button>
            `;
        }

        if (!mainViewControls.querySelector('#search-input')) {
            mainViewControls.innerHTML = `
              <div class="main-view-controls">
                <div class="search-sort-container">
                    <div class="search-container">
                        <div class="search-icon">${SearchIcon()}</div>
                        <input type="search" id="search-input" class="search-input" placeholder="Search by title...">
                    </div>
                    <div class="sort-container">
                        <select id="sort-order" class="sort-select" title="Sort order">
                            <option value="date-desc">Date: Newest</option>
                            <option value="date-asc">Date: Oldest</option>
                            <option value="title-asc">Title: A-Z</option>
                            <option value="title-desc">Title: Z-A</option>
                            <option value="category-asc">Category: A-Z</option>
                            <option value="category-desc">Category: Z-A</option>
                        </select>
                    </div>
                </div>
              </div>
            `;
            mainViewControls.querySelector('#search-input').addEventListener('input', handleSearchChange);
            mainViewControls.querySelector('#sort-order').addEventListener('change', handleSortChange);
        }
        
        const searchInput = mainViewControls.querySelector('#search-input');
        if (searchInput.value !== state.searchQuery) {
            searchInput.value = state.searchQuery;
        }
        mainViewControls.querySelector('#sort-order').value = state.sortOrder;
        
        const sortedPrompts = sortPrompts(state.prompts, state.sortOrder);
        const filteredBySearch = sortedPrompts.filter(p => 
          p.title.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
        const filteredPrompts = state.selectedCategory === 'All'
            ? filteredBySearch
            : filteredBySearch.filter(p => p.category === state.selectedCategory);

        renderPromptList(mainContent, {
            prompts: filteredPrompts,
            totalPromptsCount: state.prompts.length,
            searchQuery: state.searchQuery,
            categories,
            selectedCategory: state.selectedCategory,
            onEdit: handleOpenEditForm,
            onCopy: handleCopyPrompt,
            onInitiateDelete: handleInitiateDelete,
            onSelectCategory: handleSelectCategory,
            onView: handleOpenViewModal,
        });
    }

    renderPromptForm(formContainer, {
        isOpen: state.isFormVisible,
        onClose: handleCloseForm,
        onSave: handleSavePrompt,
        onSaveAsTemplate: handleAddTemplate,
        promptToEdit: state.editingPrompt,
        templates: state.templates,
        categories: categories.filter(c => c !== 'All'),
        showNotification,
    });

    renderConfirmationModal(confirmationModalContainer, {
        prompt: state.promptToDelete,
        onConfirm: handleConfirmDelete,
        onCancel: handleCancelDelete,
    });

    renderPromptViewModal(promptViewModalContainer, {
        prompt: state.viewingPrompt,
        onClose: handleCloseViewModal,
        onCopy: handleCopyPrompt,
    });
  };
  
  const [initialPrompts, initialTemplates, initialApiKey] = await Promise.all([getPrompts(), getTemplates(), getApiKey()]);
  setState({ prompts: initialPrompts, templates: initialTemplates, apiKey: initialApiKey });
};

export default App;