document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("textToTranslate", (data) => {
    const word = data.textToTranslate || "None";
    document.getElementById("selectedWord").innerText = word;

    if (word !== "None") {
      const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Word not found");
          }
          return response.json();
        })
        .then((result) => {
          const definitions = result[0].meanings[0].definitions[0];
          const definition = definitions.definition || "No definition available.";
          const example = definitions.example || "No example available.";

          document.getElementById("wordDefinition").innerText = definition;
          document.getElementById("wordExample").innerText = example;
        })
        .catch((error) => {
          document.getElementById("wordDefinition").innerText = `Error: ${error.message}`;
          document.getElementById("wordExample").innerText = "N/A";
        });
    }
  });
});
