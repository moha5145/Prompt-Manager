# Prompt Manager

A Chrome extension to effortlessly save, manage, and access your favorite prompts. Streamline your workflow by keeping your prompts organized and just a click away.

> **Note:** This entire Chrome extension was built with the help of Google AI Studio, showcasing the power of AI-assisted development.

## Features

- **Save & Manage**: Easily create, edit, and delete prompts.
- **Categorization**: Organize your prompts by category for quick retrieval.
- **Search & Sort**: Filter and sort your prompts by title, creation date, or category.
- **Templates**: Create reusable templates to speed up new prompt creation.
- **AI Assistance (Gemini)**:
  - **Improve**: Correct and rephrase your prompts for better clarity and effectiveness.
  - **Prompt Engineering**: Transform a simple prompt into a structured, LLM-optimized one.
- **Import/Export**: Backup and restore your prompt collection in JSON format.
- **Intuitive UI**: A modern, easy-to-use dark mode interface.

## Installation and Usage

### 1. Clone or Download

Clone this GitHub repository or download the source code as a ZIP file and unzip it.
```bash
git clone https://github.com/your-username/prompt-manager.git
cd prompt-manager
```

### 2. Load the Extension in Chrome

1.  Open Google Chrome and navigate to `chrome://extensions`.
2.  Enable **Developer mode** in the top right corner.
3.  Click the **"Load unpacked"** button.
4.  Select the `prompt-manager` folder that you cloned or unzipped.
5.  The Prompt Manager icon should now appear in your Chrome toolbar.

### 3. Configure Gemini API Key

The AI features in this extension are powered by the Google Gemini API. You must provide your own API key to enable them.

1.  **Open the extension** by clicking its icon in the toolbar.
2.  Click the **settings icon** (gear) in the top right.
3.  In the "API Key Management" section, **get your API key** by clicking the link to the [Google AI Studio](https://aistudio.google.com/app/apikey).
4.  **Paste your API key** into the input field and click **"Save Key"**.

Your key is stored securely in your browser's local storage and is never shared. You can now use all the AI-powered features!

## How to Publish to the Chrome Web Store

If you have forked this project and wish to publish your own version:

1.  **Prepare your code**: Ensure everything works correctly and customize the icons and `manifest.json` to your liking.
2.  **Create a ZIP file**: Compress the entire project folder (`prompt-manager`) into a `.zip` file. Do not include the `.git` folder.
3.  **Create a Chrome Developer Account**:
    - Go to the [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole).
    - You will need to pay a one-time registration fee (currently $5 USD) if this is your first time.
4.  **Add a New Item**:
    - On the dashboard, click **"Add new item"**.
    - Upload your `.zip` file.
5.  **Fill out the Store Listing**:
    - **Description**: Write a clear and engaging description.
    - **Icons & Screenshots**: Provide the required graphic assets. This is crucial for attracting users.
    - **Privacy Practices**: Explain how your extension handles user data. For this project, all data (prompts, templates, API key) is stored locally using `chrome.storage.local`.
6.  **Submit for Review**:
    - Once everything is filled out, submit your extension.
    - The review process by Google can take anywhere from a few hours to several days. Once approved, your extension will be live on the Chrome Web Store!

## Contributing

Contributions are welcome! If you have ideas for improvements or bug fixes, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

---

# Prompt Manager (Français)

Une extension Chrome pour sauvegarder, gérer et accéder sans effort à vos prompts favoris. Optimisez votre flux de travail en gardant vos prompts organisés et à portée de clic.

> **Note :** Cette extension Chrome a été entièrement développée avec l'aide de Google AI Studio, démontrant ainsi la puissance du développement assisté par l'IA.

## Fonctionnalités

- **Sauvegarde et Gestion** : Créez, modifiez et supprimez des prompts facilement.
- **Catégorisation** : Organisez vos prompts par catégories pour les retrouver rapidement.
- **Recherche et Tri** : Filtrez et triez vos prompts par titre, date de création ou catégorie.
- **Modèles (Templates)** : Créez des modèles réutilisables pour accélérer la création de nouveaux prompts.
- **Assistance IA (Gemini)** : 
  - **Améliorer** : Corrigez et reformulez vos prompts pour plus de clarté et d'efficacité.
  - **Ingénierie de Prompt** : Transformez un prompt simple en un prompt structuré et optimisé pour les LLMs.
- **Import/Export** : Sauvegardez et restaurez votre collection de prompts au format JSON.
- **Interface intuitive** : Une interface sombre, moderne et facile à utiliser.

## Installation et Utilisation

### 1. Cloner ou Télécharger

Clonez ce dépôt GitHub ou téléchargez le code source sous forme de fichier ZIP et décompressez-le.
```bash
git clone https://github.com/votre-nom-utilisateur/prompt-manager.git
cd prompt-manager
```

### 2. Charger l'extension dans Chrome

1.  Ouvrez Google Chrome et accédez à l'URL `chrome://extensions`.
2.  Activez le **Mode développeur** en haut à droite.
3.  Cliquez sur le bouton **"Charger l'extension non empaquetée"**.
4.  Sélectionnez le dossier `prompt-manager` que vous avez cloné ou décompressé.
5.  L'icône de Prompt Manager devrait apparaître dans votre barre d'outils Chrome.

### 3. Configuration de la Clé API Gemini

Les fonctionnalités d'IA de cette extension utilisent l'API Google Gemini. Vous devez fournir votre propre clé API pour les activer.

1.  **Ouvrez l'extension** en cliquant sur son icône dans la barre d'outils.
2.  Cliquez sur l'**icône des paramètres** (roue dentée) en haut à droite.
3.  Dans la section "API Key Management", **obtenez votre clé API** en cliquant sur le lien vers le [Google AI Studio](https://aistudio.google.com/app/apikey).
4.  **Collez votre clé API** dans le champ prévu à cet effet et cliquez sur **"Save Key"**.

Votre clé est sauvegardée de manière sécurisée dans le stockage local de votre navigateur et ne sera jamais partagée. Vous pouvez maintenant utiliser toutes les fonctionnalités d'IA !

## Comment publier sur le Chrome Web Store

Si vous avez forké ce projet et que vous souhaitez publier votre propre version :

1.  **Préparez votre code** : Assurez-vous que tout fonctionne correctement et que les icônes et le `manifest.json` sont personnalisés à votre goût.
2.  **Créez un fichier ZIP** : Compressez l'ensemble du dossier du projet (`prompt-manager`) dans un fichier `.zip`. N'incluez pas le dossier `.git`.
3.  **Créez un compte Développeur Chrome** :
    - Rendez-vous sur le [Tableau de bord du développeur Chrome](https://chrome.google.com/webstore/devconsole).
    - Vous devrez payer des frais d'inscription uniques (actuellement 5 USD) si c'est votre première fois.
4.  **Ajoutez un nouvel article** :
    - Sur le tableau de bord, cliquez sur **"Ajouter un article"**.
    - Importez votre fichier `.zip`.
5.  **Remplissez la fiche de l'extension** :
    - **Description** : Rédigez une description claire et attrayante.
    - **Icônes et Captures d'écran** : Fournissez les ressources graphiques requises. C'est crucial pour attirer les utilisateurs.
    - **Pratiques de confidentialité** : Expliquez comment votre extension gère les données des utilisateurs. Pour ce projet, les données (prompts, templates, clé API) sont stockées localement via `chrome.storage.local`.
6.  **Soumettre pour examen** :
    - Une fois que tout est rempli, soumettez votre extension.
    - Le processus d'examen par Google peut prendre de quelques heures à plusieurs jours. Une fois approuvée, votre extension sera disponible sur le Chrome Web Store !

## Contribuer

Les contributions sont les bienvenues ! Si vous avez des idées d'amélioration ou des corrections de bugs, n'hésitez pas à ouvrir une "Issue" ou à soumettre une "Pull Request".

## Licence

Ce projet est sous licence MIT.