import { CloseIcon, SparkleIcon, SpinnerIcon, EngineerIcon, ImageIcon } from './Icons.js';
import { callGeminiAPI, callGeminiAPIMultimodal, storage } from '../hooks/usePrompts.js';
import { t } from '../lib/i18n.js';

const DRAFT_KEY = 'promptFormDraft';

export const renderPromptForm = (container, props) => {
  const { isOpen, onClose, onSave, onSaveAsTemplate, promptToEdit, showNotification, categories, templates } = props;

  if (!isOpen) {
    container.innerHTML = '';
    return;
  }
  
  let imageState = {
    base64: null,
    mimeType: null,
  };
  
  const categoryOptions = categories.map(cat => `<option value="${cat}"></option>`).join('');
  const templateOptions = templates.map(temp => `<option value="${temp.id}">${temp.title}</option>`).join('');

  const templateSelectorHtml = !promptToEdit && templates.length > 0 ? `
    <div class="form-group">
        <label for="template-select">${t('useTemplate')}</label>
        <select id="template-select" class="form-select">
            <option value="">${t('selectTemplate')}</option>
            ${templateOptions}
        </select>
    </div>
  ` : '';

  container.innerHTML = `
    <div class="modal-overlay visible">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">${promptToEdit ? t('editPromptTitle') : t('addPromptTitle')}</h2>
          <button class="modal-close-btn">${CloseIcon()}</button>
        </div>
        <form class="modal-body">
          ${templateSelectorHtml}
          <div class="form-group">
            <label for="title">${t('formTitle')}</label>
            <input id="title" type="text" class="form-input" placeholder="${t('formTitlePlaceholder')}" required />
          </div>
          <div class="form-group">
            <label for="category">${t('formCategory')}</label>
            <input id="category" type="text" class="form-input" list="category-list" placeholder="${t('formCategoryPlaceholder')}" />
            <datalist id="category-list">
                ${categoryOptions}
            </datalist>
          </div>
          <div class="form-group">
            <label for="text">${t('formPromptText')}</label>
            <div id="image-dropzone" class="image-dropzone">
                ${ImageIcon()}
                <span>${t('pasteImageHere')}</span>
            </div>
            <div id="image-preview-wrapper" style="display: none;">
                <img id="form-image-preview" src="" alt="Image preview" />
                <button type="button" id="remove-image-btn" title="Remove image">
                    ${CloseIcon()}
                </button>
            </div>
            <div class="textarea-container">
              <textarea id="text" rows="8" class="form-textarea" placeholder="${t('formPromptTextPlaceholder')}" required></textarea>
              <div class="ai-actions">
                <button type="button" id="ai-generate-btn" class="btn-ai" title="${t('generateWithAI')}">
                    ${EngineerIcon()} <span>${t('generateWithAI')}</span>
                </button>
                <button type="button" id="improve-btn" class="btn-ai" title="${t('improveWithAI')}">
                    ${SparkleIcon()} <span>${t('improve')}</span>
                </button>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <div style="margin-right: auto;">
                <button type="button" id="cancel-form-btn" class="btn" style="background-color: var(--btn-secondary-bg);">${t('cancel')}</button>
            </div>
            <button type="button" id="save-as-template-btn" class="btn" style="background-color: var(--btn-secondary-bg); margin-right: 0.75rem;">${t('saveAsTemplate')}</button>
            <button type="submit" class="btn btn-primary">${promptToEdit ? t('saveChanges') : t('addPrompt')}</button>
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
  const generateBtn = container.querySelector('#ai-generate-btn');
  const templateSelect = container.querySelector('#template-select');
  const saveAsTemplateBtn = container.querySelector('#save-as-template-btn');
  const cancelFormBtn = container.querySelector('#cancel-form-btn');
  
  const imageDropzone = container.querySelector('#image-dropzone');
  const imagePreviewWrapper = container.querySelector('#image-preview-wrapper');
  const imagePreview = container.querySelector('#form-image-preview');
  const removeImageBtn = container.querySelector('#remove-image-btn');

  // --- DRAFT LOGIC ---
  const saveDraft = async () => {
    if (promptToEdit) return; // Only save drafts for new prompts
    const draft = {
      title: titleInput.value,
      category: categoryInput.value,
      text: textInput.value,
      image: imageState,
    };
    await storage.set({ [DRAFT_KEY]: draft });
  };

  const loadDraft = async () => {
    if (promptToEdit) return;
    const result = await storage.get(DRAFT_KEY);
    const savedDraft = result[DRAFT_KEY];
    if (savedDraft) {
        const draft = savedDraft;
        titleInput.value = draft.title || '';
        categoryInput.value = draft.category === 'Uncategorized' ? t('uncategorized') : (draft.category || '');
        textInput.value = draft.text || '';
        if (draft.image && draft.image.base64) {
            imageState = draft.image;
            imagePreview.src = imageState.base64;
            imagePreviewWrapper.style.display = 'block';
            imageDropzone.style.display = 'none';
        }
    }
  };

  const clearDraft = async () => {
    await storage.set({ [DRAFT_KEY]: null });
  };
  // --- END DRAFT LOGIC ---
  
  if (promptToEdit) {
    titleInput.value = promptToEdit.title;
    textInput.value = promptToEdit.text;
    categoryInput.value = promptToEdit.category === 'Uncategorized' ? t('uncategorized') : (promptToEdit.category || '');
  } else {
    // Asynchronously load draft for new prompts
    (async () => {
        await loadDraft();
        updateButtonState(); // Ensure button state is correct after loading
    })();
  }

  if (templateSelect) {
      templateSelect.addEventListener('change', (e) => {
          const selectedTemplateId = e.target.value;
          const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
          if (selectedTemplate) {
              titleInput.value = selectedTemplate.title;
              textInput.value = selectedTemplate.text;
              updateButtonState();
              saveDraft();
              textInput.focus();
          }
      });
  }
  
  form.addEventListener('paste', (e) => {
    if (e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
            e.preventDefault();
            
            const reader = new FileReader();
            reader.onload = (event) => {
                imageState.base64 = event.target.result;
                imageState.mimeType = file.type;
                imagePreview.src = imageState.base64;
                imagePreviewWrapper.style.display = 'block';
                imageDropzone.style.display = 'none';
                updateButtonState();
                saveDraft();
            };
            reader.readAsDataURL(file);
        }
    }
  });
  
  removeImageBtn.addEventListener('click', () => {
    imageState.base64 = null;
    imageState.mimeType = null;
    imagePreview.src = '';
    imagePreviewWrapper.style.display = 'none';
    imageDropzone.style.display = 'flex';
    updateButtonState();
    saveDraft();
  });


  if (saveAsTemplateBtn) {
    saveAsTemplateBtn.addEventListener('click', () => {
      const title = titleInput.value.trim();
      const text = textInput.value.trim();
      if (title && text) {
        onSaveAsTemplate({ title, text });
      } else {
        showNotification(t('notificationTemplateSaveInfo'), 'info');
      }
    });
  }
  
  const updateButtonState = () => {
    const textIsEmpty = !textInput.value.trim();
    const hasImage = !!imageState.base64;
    improveBtn.disabled = textIsEmpty;
    generateBtn.disabled = textIsEmpty && !hasImage;
  };

  textInput.addEventListener('input', () => {
    updateButtonState();
    saveDraft();
  });
  titleInput.addEventListener('input', saveDraft);
  categoryInput.addEventListener('input', saveDraft);

  updateButtonState();

  const setProcessingState = (isProcessing, button, originalContent) => {
      if (isProcessing) {
          button.innerHTML = `${SpinnerIcon()} ${t('processing')}`;
          button.disabled = true;
          improveBtn.disabled = true;
          generateBtn.disabled = true;
      } else {
          button.innerHTML = originalContent;
          updateButtonState();
      }
  };
  
  const handleAiAction = async (button, promptGenerator, apiCaller) => {
      const originalContent = button.innerHTML;
      setProcessingState(true, button, originalContent);
      try {
          const prompt = promptGenerator(textInput.value);
          const resultText = await apiCaller(prompt);
          textInput.value = resultText;
          saveDraft();
          showNotification(t('notificationPromptUpdated'), 'success');
      } catch (e) {
          console.error(e);
          showNotification(t(e.message) || t('error_failed_to_update_prompt'), 'error');
      } finally {
          setProcessingState(false, button, originalContent);
      }
  };
  
  generateBtn.addEventListener('click', async () => {
    if (imageState.base64) {
        const originalContent = generateBtn.innerHTML;
        setProcessingState(true, generateBtn, originalContent);
        try {
            const userInstruction = textInput.value.trim();
            const base64Data = imageState.base64.split(',')[1];
            
            let systemPrompt;
            if (userInstruction) {
                systemPrompt = `Using the provided image as context, follow these instructions precisely: "${userInstruction}". Generate only the final text output based on the instructions. Do not add any introductory phrases.`;
            } else {
                systemPrompt = `Analyze the provided image and generate a detailed, creative prompt that could be used to create a similar image. The prompt should capture the subject, style, mood, and composition. Return only the generated prompt text.`;
            }

            const resultText = await callGeminiAPIMultimodal(systemPrompt, base64Data, imageState.mimeType);
            textInput.value = resultText;
            saveDraft();
            showNotification(t('notificationPromptGenerated'), 'success');
        } catch (e) {
            console.error(e);
            showNotification(t(e.message) || t('error_failed_to_generate_from_image'), 'error');
        } finally {
            setProcessingState(false, generateBtn, originalContent);
        }

    } else {
        handleAiAction(generateBtn, (currentText) => 
          `Analyze the following prompt and re-engineer it to be more effective for a large language model. Apply prompt engineering principles such as:
1. Adding a clear role or persona for the AI (e.g., "You are an expert copywriter...").
2. Specifying the desired output format (e.g., list, JSON, paragraph).
3. Providing context, constraints, and clear, direct instructions.
4. Structuring the prompt for clarity.

Return ONLY the re-engineered prompt, without any explanations or introductory phrases.

Original Prompt:
"${currentText}"`, (prompt) => callGeminiAPI(prompt));
    }
  });


  improveBtn.addEventListener('click', () => {
    handleAiAction(improveBtn, (currentText) => 
      `Correct any spelling or grammar mistakes and improve the phrasing of the following text. Make it clearer, more concise, and more effective. Return only the improved text, without any additional explanations or introductory phrases.\n\nOriginal text:\n"${currentText}"`,
      (prompt) => callGeminiAPI(prompt)
    );
  });

  container.querySelector('.modal-close-btn')?.addEventListener('click', onClose);
  container.querySelector('.modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) onClose();
  });
  if (cancelFormBtn) {
    cancelFormBtn.addEventListener('click', onClose);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (titleInput.value.trim() && textInput.value.trim()) {
      let categoryValue = categoryInput.value.trim();
      if (categoryValue === t('uncategorized')) {
          categoryValue = 'Uncategorized';
      }
      onSave({ 
        title: titleInput.value.trim(), 
        text: textInput.value.trim(),
        category: categoryValue
      });
      await clearDraft();
    }
  });
};