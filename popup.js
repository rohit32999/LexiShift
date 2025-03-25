document.addEventListener("DOMContentLoaded", async () => {
  chrome.storage.local.get("textToTranslate", async (data) => {
    const word = data.textToTranslate || "None";
    document.getElementById("selectedWord").innerText = word;

    if (word !== "None") {
      const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Word not found");
        }
        const result = await response.json();
        const definitions = result[0].meanings[0].definitions[0];
        const definition = definitions.definition || "No definition available.";
        const example = definitions.example || "No example available.";

        document.getElementById("wordDefinition").innerText = definition;
        document.getElementById("wordExample").innerText = example;
      } catch (error) {
        document.getElementById("wordDefinition").innerText = `Error: ${error.message}`;
        document.getElementById("wordExample").innerText = "N/A";
      }
    }
  });
});
