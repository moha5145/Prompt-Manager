import { CloseIcon, SparkleIcon, SpinnerIcon, EngineerIcon } from './Icons.js';
import { callGeminiAPI } from '../hooks/usePrompts.js';

export const renderPromptForm = (container, props) => {
  const { isOpen, onClose, onSave, onSaveAsTemplate, promptToEdit, showNotification, categories, templates } = props;

  if (!isOpen) {
    container.innerHTML = '';
    return;
  }
  
  const categoryOptions = categories.map(cat => `<option value="${cat}"></option>`).join('');
  const templateOptions = templates.map(temp => `<option value="${temp.id}">${temp.title}</option>`).join('');

  const templateSelectorHtml = !promptToEdit && templates.length > 0 ? `
    <div class="form-group">
        <label for="template-select">Use a template (optional)</label>
        <select id="template-select" class="form-select">
            <option value="">Select a template...</option>
            ${templateOptions}
        </select>
    </div>
  ` : '';

  container.innerHTML = `
    <div class="modal-overlay visible">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">${promptToEdit ? 'Edit Prompt' : 'Add New Prompt'}</h2>
          <button class="modal-close-btn">${CloseIcon()}</button>
        </div>
        <form class="modal-body">
          ${templateSelectorHtml}
          <div class="form-group">
            <label for="title">Title</label>
            <input id="title" type="text" class="form-input" placeholder="e.g., 'Creative Story Starter'" required />
          </div>
          <div class="form-group">
            <label for="category">Category (optional)</label>
            <input id="category" type="text" class="form-input" list="category-list" placeholder="e.g., 'Marketing'" />
            <datalist id="category-list">
                ${categoryOptions}
            </datalist>
          </div>
          <div class="form-group">
            <label for="text">Prompt Text</label>
            <div class="textarea-container">
              <textarea id="text" rows="8" class="form-textarea" placeholder="Enter your prompt text here..." required></textarea>
              <div class="ai-actions">
                <button type="button" id="engineer-btn" class="btn-ai" title="Engineer Prompt">
                    ${EngineerIcon()} <span>Engineer</span>
                </button>
                <button type="button" id="improve-btn" class="btn-ai" title="Improve with AI">
                    ${SparkleIcon()} <span>Improve</span>
                </button>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <div style="margin-right: auto;">
                <button type="button" id="cancel-form-btn" class="btn" style="background-color: var(--btn-secondary-bg);">Cancel</button>
            </div>
            <button type="button" id="save-as-template-btn" class="btn" style="background-color: var(--btn-secondary-bg); margin-right: 0.75rem;">Save as Template</button>
            <button type="submit" class="btn btn-primary">${promptToEdit ? 'Save Changes' : 'Add Prompt'}</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const form = container.querySelector('form');
  const titleInput = container.querySelector('#title');
  const categoryInput = container.querySelector('#category');
  const textInput = container.querySelector('#text');
  const improveBtn = container.querySelector('#improve-btn');
  const engineerBtn = container.querySelector('#engineer-btn');
  const templateSelect = container.querySelector('#template-select');
  const saveAsTemplateBtn = container.querySelector('#save-as-template-btn');
  const cancelFormBtn = container.querySelector('#cancel-form-btn');

  if (promptToEdit) {
    titleInput.value = promptToEdit.title;
    textInput.value = promptToEdit.text;
    categoryInput.value = promptToEdit.category || '';
  }

  if (templateSelect) {
      templateSelect.addEventListener('change', (e) => {
          const selectedTemplateId = e.target.value;
          const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
          if (selectedTemplate) {
              titleInput.value = selectedTemplate.title;
              textInput.value = selectedTemplate.text;
              updateButtonState();
              textInput.focus();
          }
      });
  }

  if (saveAsTemplateBtn) {
    saveAsTemplateBtn.addEventListener('click', () => {
      const title = titleInput.value.trim();
      const text = textInput.value.trim();
      if (title && text) {
        onSaveAsTemplate({ title, text });
      } else {
        showNotification('Title and text are required to save a template.', 'info');
      }
    });
  }
  
  const updateButtonState = () => {
    const textIsEmpty = !textInput.value.trim();
    improveBtn.disabled = textIsEmpty;
    engineerBtn.disabled = textIsEmpty;
  };

  textInput.addEventListener('input', updateButtonState);
  updateButtonState();

  const setProcessingState = (button, isProcessing, originalContent) => {
      if (isProcessing) {
          button.innerHTML = `${SpinnerIcon()} Processing...`;
          button.disabled = true;
          improveBtn.disabled = true;
          engineerBtn.disabled = true;
      } else {
          button.innerHTML = originalContent;
          updateButtonState();
      }
  };

  const handleAiAction = async (button, promptGenerator) => {
      const originalContent = button.innerHTML;
      setProcessingState(button, true, originalContent);
      try {
          const prompt = promptGenerator(textInput.value);
          const resultText = await callGeminiAPI(prompt);
          textInput.value = resultText;
          showNotification(`Prompt ${button.id.split('-')[0]}ed with AI!`, 'success');
      } catch (e) {
          console.error(e);
          showNotification(e.message || `Failed to ${button.id.split('-')[0]} prompt.`, 'error');
      } finally {
          setProcessingState(button, false, originalContent);
      }
  };

  improveBtn.addEventListener('click', () => {
    handleAiAction(improveBtn, (currentText) => 
      `Correct any spelling or grammar mistakes and improve the phrasing of the following text. Make it clearer, more concise, and more effective. Return only the improved text, without any additional explanations or introductory phrases.\n\nOriginal text:\n"${currentText}"`
    );
  });
  
  engineerBtn.addEventListener('click', () => {
     handleAiAction(engineerBtn, (currentText) => 
      `Analyze the following prompt and re-engineer it to be more effective for a large language model. Apply prompt engineering principles such as:
1. Adding a clear role or persona for the AI (e.g., "You are an expert copywriter...").
2. Specifying the desired output format (e.g., list, JSON, paragraph).
3. Providing context, constraints, and clear, direct instructions.
4. Structuring the prompt for clarity.

Return ONLY the re-engineered prompt, without any explanations or introductory phrases.

Original Prompt:
"${currentText}"`
    );
  });

  container.querySelector('.modal-close-btn')?.addEventListener('click', onClose);
  container.querySelector('.modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) onClose();
  });
  if (cancelFormBtn) {
    cancelFormBtn.addEventListener('click', onClose);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (titleInput.value.trim() && textInput.value.trim()) {
      onSave({ 
        title: titleInput.value, 
        text: textInput.value,
        category: categoryInput.value 
      });
    }
  });
};