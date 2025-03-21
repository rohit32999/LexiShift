chrome.storage.local.get(["textToTranslate", "targetLanguages"], (data) => {
    const word = data.textToTranslate;
    const targetLanguages = data.targetLanguages; // Changed to handle multiple languages
  
    if (word && targetLanguages && targetLanguages.length > 0) {
      const translateApiUrl = "https://libretranslate.com/translate";
      const translations = [];
      
      targetLanguages.forEach(targetLanguage => {
        fetch(translateApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: word,
            source: "en",
            target: targetLanguage,
            format: "text",
          }),
        })
          .then(async (response) => {
            if (!response.ok) {
              // Log response for debugging
              const errorText = await response.text();
              console.error("API Response:", response.status, errorText);
              throw new Error("Translation failed");
            }
            return response.json();
          })
          .then((translationResult) => {
            const translatedWord = translationResult.translatedText;
            translations.push(`Translated Word in ${targetLanguage}: ${translatedWord}`);
            
            // Check if all translations are done
            if (translations.length === targetLanguages.length) {
              showTranslationsModal(translations);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert(`Error: ${error.message}`);
          });
      });
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
