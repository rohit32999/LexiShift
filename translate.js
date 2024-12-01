chrome.storage.local.get(["textToTranslate", "targetLanguage"], (data) => {
    const word = data.textToTranslate;
    const targetLanguage = data.targetLanguage;
  
    if (word && targetLanguage) {
      const translateApiUrl = "https://libretranslate.com/translate";
  
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
          alert(`Translated Word: ${translatedWord}`);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert(`Error: ${error.message}`);
        });
    } else {
      alert("No word selected or target language not set.");
    }
  });
  