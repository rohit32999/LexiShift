// Cache utility functions
function getCacheKey(word, targetLang) {
  return `${word.toLowerCase()}-${targetLang}`;
}

function checkCache(word, targetLang) {
  const cacheKey = getCacheKey(word, targetLang);
  return chrome.storage.local.get(cacheKey)
    .then(result => result[cacheKey]);
}

function saveToCache(word, targetLang, translation) {
  const cacheKey = getCacheKey(word, targetLang);
  const cacheData = {
    translation,
    timestamp: Date.now()
  };
  return chrome.storage.local.set({ [cacheKey]: cacheData });
}

chrome.storage.local.get(["textToTranslate", "targetLanguages"], async (data) => {
  const word = data.textToTranslate;
  const targetLanguages = data.targetLanguages;

  if (word && targetLanguages && targetLanguages.length > 0) {
    const translateApiUrl = "https://libretranslate.com/translate";
    const translations = [];
    const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

    for (const targetLanguage of targetLanguages) {
      try {
        // Check cache first
        const cachedData = await checkCache(word, targetLanguage);
        if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_EXPIRY) {
          translations.push(`Translated Word in ${targetLanguage}: ${cachedData.translation}`);
          continue;
        }

        const response = await fetch(translateApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: word,
            source: "en",
            target: targetLanguage,
            format: "text",
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Response:", response.status, errorText);
          throw new Error("Translation failed");
        }

        const translationResult = await response.json();
        const translatedWord = translationResult.translatedText;
        
        // Save to cache
        await saveToCache(word, targetLanguage, translatedWord);
        translations.push(`Translated Word in ${targetLanguage}: ${translatedWord}`);
      } catch (error) {
        console.error("Error:", error);
        alert(`Error: ${error.message}`);
      }
    }

    if (translations.length > 0) {
      showTranslationsModal(translations);
    }
  } else {
    alert("No word selected or target languages not set.");
  }
});

function showTranslationsModal(translations) {
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.backgroundColor = 'white';
  modal.style.padding = '20px';
  modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
  modal.style.zIndex = '1000';

  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.onclick = () => document.body.removeChild(modal);

  const translationsList = document.createElement('ul');
  translations.forEach(translation => {
    const listItem = document.createElement('li');
    listItem.textContent = translation;
    translationsList.appendChild(listItem);
  });

  modal.appendChild(translationsList);
  modal.appendChild(closeButton);
  document.body.appendChild(modal);
}
