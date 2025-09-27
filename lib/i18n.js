import { storage } from '../hooks/usePrompts.js';

const translations = {
  en: {
    appName: 'Prompt Manager',
    new: 'New',
    openInNewTab: 'Open in new tab',
    settings: 'Settings',
    back: 'Back',
    searchByTitle: 'Search by title...',
    sortDateNewest: 'Date: Newest',
    sortDateOldest: 'Date: Oldest',
    sortTitleAZ: 'Title: A-Z',
    sortTitleZA: 'Title: Z-A',
    sortCategoryAZ: 'Category: A-Z',
    sortCategoryZA: 'Category: Z-A',
    all: 'All',
    uncategorized: 'Uncategorized',
    noPromptsYet: 'No Prompts Yet',
    noPromptsYetDesc: 'Click the "New" button to add your first prompt.',
    noResultsFound: 'No Results Found',
    noResultsFoundDesc: 'Your search for "{query}" did not match any prompts.',
    copyPrompt: 'Copy Prompt',
    editPrompt: 'Edit Prompt',
    deletePrompt: 'Delete Prompt',
    addPromptTitle: 'Add New Prompt',
    editPromptTitle: 'Edit Prompt',
    useTemplate: 'Use a template (optional)',
    selectTemplate: 'Select a template...',
    formTitle: 'Title',
    formTitlePlaceholder: "e.g., 'Creative Story Starter'",
    formCategory: 'Category (optional)',
    formCategoryPlaceholder: "e.g., 'Marketing'",
    formPromptText: 'Prompt Text',
    pasteImageHere: 'Paste image here',
    formPromptTextPlaceholder: 'Add instructions for the image, or enter a text prompt...',
    generateWithAI: 'Generate with AI',
    improveWithAI: 'Improve',
    cancel: 'Cancel',
    saveAsTemplate: 'Save as Template',
    saveChanges: 'Save Changes',
    addPrompt: 'Add Prompt',
    confirmDeleteTitle: 'Delete Prompt',
    confirmDeleteMessage: 'Are you sure you want to delete the prompt titled "{title}"? This action cannot be undone.',
    delete: 'Delete',
    promptViewClose: 'Close',
    promptViewCopy: 'Copy Text',
    promptViewCopied: 'Copied!',
    language: 'Language',
    english: 'English',
    french: 'French',
    settingsAPIKey: 'API Key Management',
    settingsAPIKeyDesc: 'Your Gemini API key is required for AI features. Get your key from {link}. It is stored securely in your browser\'s local storage.',
    settingsAPIKeyInputLabel: 'Gemini API Key',
    settingsAPIKeyInputPlaceholder: 'Enter your API key',
    toggleVisibility: 'Toggle visibility',
    saveKey: 'Save Key',
    settingsData: 'Data Management',
    settingsDataDesc: 'Save your prompts to a file or load them from a backup.',
    exportPrompts: 'Export Prompts',
    importPrompts: 'Import Prompts',
    settingsTemplates: 'Prompt Templates',
    settingsTemplatesDesc: 'Create reusable templates to speed up prompt creation.',
    templateTitle: 'Template Title',
    templateTitlePlaceholder: "e.g., 'Persona Generator'",
    templateText: 'Template Text',
    templateTextPlaceholder: "e.g., 'Act as a {{role}} and describe...'",
    improve: 'Improve',
    saveTemplate: 'Save Template',
    savedTemplates: 'Saved Templates',
    noTemplatesSaved: 'No templates saved yet.',
    processing: 'Processing...',
    notificationPromptUpdated: 'Prompt updated successfully!',
    notificationPromptAdded: 'Prompt added successfully!',
    notificationPromptDeleted: 'Prompt deleted.',
    notificationUndo: 'Undo',
    notificationNoPromptsToExport: 'No prompts to export.',
    notificationExportSuccess: 'Prompts exported successfully!',
    notificationImportSuccess: '{count} new prompt(s) imported successfully!',
    notificationImportNoNew: 'No new prompts were found to import.',
    notificationImportFailed: 'Failed to import prompts. Please check the file format.',
    notificationTemplateImproved: 'Template improved with AI!',
    notificationTemplateSaved: 'Template saved successfully!',
    notificationTemplateDeleted: 'Template deleted.',
    notificationAPIKeySaved: 'API Key saved successfully!',
    notificationTemplateSaveInfo: 'Title and text are required to save a template.',
    notificationPromptGenerated: 'Prompt generated from image!',
    error_api_key_missing: 'API key not configured. Please add your key in the Settings page.',
    error_api_call_failed: 'API call failed. Please check your key and network, then see the console for details.',
    error_failed_to_improve: 'Failed to improve template.',
    error_failed_to_update_prompt: 'Failed to update prompt.',
    error_failed_to_generate_from_image: 'Failed to generate from image.',
  },
  fr: {
    appName: 'Gestionnaire de Prompts',
    new: 'Nouveau',
    openInNewTab: 'Ouvrir dans un nouvel onglet',
    settings: 'Paramètres',
    back: 'Retour',
    searchByTitle: 'Rechercher par titre...',
    sortDateNewest: 'Date : Plus récent',
    sortDateOldest: 'Date : Plus ancien',
    sortTitleAZ: 'Titre : A-Z',
    sortTitleZA: 'Titre : Z-A',
    sortCategoryAZ: 'Catégorie : A-Z',
    sortCategoryZA: 'Catégorie : Z-A',
    all: 'Tout',
    uncategorized: 'Non classé',
    noPromptsYet: 'Aucun prompt pour le moment',
    noPromptsYetDesc: 'Cliquez sur le bouton "Nouveau" pour ajouter votre premier prompt.',
    noResultsFound: 'Aucun résultat trouvé',
    noResultsFoundDesc: 'Votre recherche pour "{query}" ne correspond à aucun prompt.',
    copyPrompt: 'Copier le prompt',
    editPrompt: 'Modifier le prompt',
    deletePrompt: 'Supprimer le prompt',
    addPromptTitle: 'Ajouter un nouveau prompt',
    editPromptTitle: 'Modifier le prompt',
    useTemplate: 'Utiliser un modèle (optionnel)',
    selectTemplate: 'Sélectionner un modèle...',
    formTitle: 'Titre',
    formTitlePlaceholder: "ex: 'Générateur d'histoire créative'",
    formCategory: 'Catégorie (optionnel)',
    formCategoryPlaceholder: "ex: 'Marketing'",
    formPromptText: 'Texte du prompt',
    pasteImageHere: 'Coller une image ici',
    formPromptTextPlaceholder: "Ajoutez des instructions pour l'image, ou entrez un prompt texte...",
    generateWithAI: 'Générer avec l\'IA',
    improveWithAI: 'Améliorer',
    cancel: 'Annuler',
    saveAsTemplate: 'Enregistrer comme modèle',
    saveChanges: 'Enregistrer',
    addPrompt: 'Ajouter le prompt',
    confirmDeleteTitle: 'Supprimer le prompt',
    confirmDeleteMessage: 'Êtes-vous sûr de vouloir supprimer le prompt intitulé "{title}" ? Cette action est irréversible.',
    delete: 'Supprimer',
    promptViewClose: 'Fermer',
    promptViewCopy: 'Copier le texte',
    promptViewCopied: 'Copié !',
    language: 'Langue',
    english: 'English',
    french: 'Français',
    settingsAPIKey: 'Gestion de la clé API',
    settingsAPIKeyDesc: 'Votre clé API Gemini est requise pour les fonctionnalités IA. Obtenez votre clé depuis {link}. Elle est stockée de manière sécurisée dans le stockage local de votre navigateur.',
    settingsAPIKeyInputLabel: 'Clé API Gemini',
    settingsAPIKeyInputPlaceholder: 'Entrez votre clé API',
    toggleVisibility: 'Basculer la visibilité',
    saveKey: 'Enregistrer la clé',
    settingsData: 'Gestion des données',
    settingsDataDesc: 'Enregistrez vos prompts dans un fichier ou chargez-les depuis une sauvegarde.',
    exportPrompts: 'Exporter les prompts',
    importPrompts: 'Importer les prompts',
    settingsTemplates: 'Modèles de prompts',
    settingsTemplatesDesc: 'Créez des modèles réutilisables pour accélérer la création de prompts.',
    templateTitle: 'Titre du modèle',
    templateTitlePlaceholder: "ex: 'Générateur de Persona'",
    templateText: 'Texte du modèle',
    templateTextPlaceholder: "ex: 'Agis comme un {{role}} et décris...'",
    improve: 'Améliorer',
    saveTemplate: 'Enregistrer le modèle',
    savedTemplates: 'Modèles enregistrés',
    noTemplatesSaved: 'Aucun modèle enregistré pour le moment.',
    processing: 'Traitement...',
    notificationPromptUpdated: 'Prompt mis à jour avec succès !',
    notificationPromptAdded: 'Prompt ajouté avec succès !',
    notificationPromptDeleted: 'Prompt supprimé.',
    notificationUndo: 'Annuler',
    notificationNoPromptsToExport: 'Aucun prompt à exporter.',
    notificationExportSuccess: 'Prompts exportés avec succès !',
    notificationImportSuccess: '{count} nouveau(x) prompt(s) importé(s) avec succès !',
    notificationImportNoNew: "Aucun nouveau prompt n'a été trouvé pour l'importation.",
    notificationImportFailed: "Échec de l'importation des prompts. Veuillez vérifier le format du fichier.",
    notificationTemplateImproved: 'Modèle amélioré avec l\'IA !',
    notificationTemplateSaved: 'Modèle enregistré avec succès !',
    notificationTemplateDeleted: 'Modèle supprimé.',
    notificationAPIKeySaved: 'Clé API enregistrée avec succès !',
    notificationTemplateSaveInfo: 'Un titre et un texte sont requis pour enregistrer un modèle.',
    notificationPromptGenerated: "Prompt généré à partir de l'image !",
    error_api_key_missing: "Clé API non configurée. Veuillez ajouter votre clé dans la page des Paramètres.",
    error_api_call_failed: "L'appel API a échoué. Veuillez vérifier votre clé et votre réseau, puis consultez la console pour plus de détails.",
    error_failed_to_improve: "Échec de l'amélioration du modèle.",
    error_failed_to_update_prompt: 'Échec de la mise à jour du prompt.',
    error_failed_to_generate_from_image: "Échec de la génération à partir de l'image.",
  }
};

const defaultTemplates = {
  en: [
    { id: 'template_default_1', title: 'Persona Generator', text: 'Act as a {{persona_role}}. You are an expert in {{domain}}. Your task is to respond to the following request in the persona described.\n\nRequest: {{user_request}}'},
    { id: 'template_default_2', title: 'Text Summarizer', text: 'Summarize the following text into {{number}} key bullet points. Focus on the main ideas and conclusions.\n\nText:\n"""\n{{text_to_summarize}}\n"""'},
    { id: 'template_default_3', title: 'Email Writer', text: 'Write a professional email with the following characteristics:\n- Tone: {{tone_of_email}}\n- Recipient: {{recipient}}\n- Goal: {{goal_of_email}}\n- Key points to include: {{key_points}}\n\nGenerate the email subject and body.'},
    { id: 'template_default_4', title: 'Code Explainer', text: 'Act as an expert software engineer. Explain the following code snippet in a clear and concise way. Describe what it does, how it works, and suggest potential improvements.\n\nLanguage: {{programming_language}}\n\nCode:\n```\n{{code_snippet}}\n```'}
  ],
  fr: [
    { id: 'template_default_1', title: 'Générateur de Persona', text: 'Agis en tant que {{rôle_persona}}. Tu es un expert en {{domaine}}. Ta tâche est de répondre à la requête suivante dans la persona décrite.\n\nRequête : {{requête_utilisateur}}' },
    { id: 'template_default_2', title: 'Résumeur de Texte', text: 'Résume le texte suivant en {{nombre}} points clés. Concentre-toi sur les idées principales et les conclusions.\n\nTexte :\n"""\n{{texte_à_résumer}}\n"""' },
    { id: 'template_default_3', title: 'Rédacteur d\'Email', text: 'Rédige un email professionnel avec les caractéristiques suivantes :\n- Ton : {{ton_de_l_email}}\n- Destinataire : {{destinataire}}\n- Objectif : {{objectif_de_l_email}}\n- Points clés à inclure : {{points_clés}}\n\nGénère l\'objet et le corps de l\'email.' },
    { id: 'template_default_4', title: 'Expliqueur de Code', text: 'Agis en tant qu\'ingénieur logiciel expert. Explique le fragment de code suivant de manière claire et concise. Décris ce qu\'il fait, comment il fonctionne, et suggère des améliorations potentielles.\n\nLangage : {{langage_programmation}}\n\nCode :\n```\n{{fragment_code}}\n```' }
  ]
};

let currentLocale = 'en';

export const init = async () => {
    const data = await storage.get('user_language');
    const savedLang = data.user_language;

    if (savedLang && translations[savedLang]) {
        currentLocale = savedLang;
    } else {
        if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getUILanguage) {
            const browserLang = chrome.i18n.getUILanguage();
            if (browserLang.startsWith('fr')) {
                currentLocale = 'fr';
            }
        }
    }
};

export const getLocale = () => currentLocale;

export const setLanguage = async (lang) => {
    if (translations[lang]) {
        currentLocale = lang;
        await storage.set({ 'user_language': lang });
    }
};

export const getDefaultTemplates = () => {
    return defaultTemplates[currentLocale] || defaultTemplates['en'];
};

export const t = (key, replacements = {}) => {
  let translation = translations[currentLocale]?.[key] || translations.en[key] || key;

  for (const placeholder in replacements) {
    translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
  }

  return translation;
};