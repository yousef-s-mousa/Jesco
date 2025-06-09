class LanguageManager {
  constructor() {
    this.currentLanguage = localStorage.getItem('language') || 'en';
    this.translations = {};
    this.init();
  }

  async init() {
    await this.loadLanguage(this.currentLanguage);
    this.updateLanguageSelector();
    this.translatePage();
  }

  async loadLanguage(lang) {
    try {
      const response = await fetch(`languages/${lang}.json`);
      this.translations = await response.json();
      this.currentLanguage = lang;
      localStorage.setItem('language', lang);
    } catch (error) {
      console.error('Error loading language:', error);
      // Fallback to English
      if (lang !== 'en') {
        await this.loadLanguage('en');
      }
    }
  }

  translatePage() {
    document.querySelectorAll('[data-translate]').forEach(element => {
      const key = element.getAttribute('data-translate');
      const translation = this.getTranslation(key);
      if (translation) {
        if (element.tagName === 'INPUT' || element.type === 'text') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });
  }

  getTranslation(key) {
    const keys = key.split('.');
    let translation = this.translations;
    
    for (const k of keys) {
      translation = translation[k];
      if (!translation) return null;
    }
    
    return translation;
  }

  updateLanguageSelector() {
    const selector = document.getElementById('languageSelect');
    if (selector) {
      selector.value = this.currentLanguage;
    }
  }

  async changeLanguage(lang) {
    await this.loadLanguage(lang);
    this.translatePage();
    this.updateLanguageSelector();
  }
}

// Initialize language manager
const languageManager = new LanguageManager();

// Global function for language change
async function changeLanguage() {
  const selector = document.getElementById('languageSelect');
  const selectedLang = selector.value;
  await languageManager.changeLanguage(selectedLang);
}
