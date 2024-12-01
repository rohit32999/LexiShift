chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showMeaning") {
    const word = message.word;

    // Remove existing popup
    const existingPopup = document.getElementById("meaningPopup");
    if (existingPopup) {
      existingPopup.remove();
    }

    // Create the popup
    const popup = document.createElement("div");
    popup.id = "meaningPopup";
    popup.style.position = "fixed";
    popup.style.bottom = "20px";
    popup.style.right = "20px";
    popup.style.width = "300px";
    popup.style.background = "rgba(0,0,0,0.6)"; // Transparent white
    popup.style.border = "1px solid rgba(255, 255, 255, 0.3)"; // Light border
    popup.style.backdropFilter = "blur(10px)"; // Blur effect
    popup.style.color = "#fff"; // White text
    popup.style.padding = "15px";
    popup.style.borderRadius = "16px"; // Rounded corners
    popup.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.25)"; // Soft shadow
    popup.style.zIndex = "10000";
    popup.style.fontFamily = "Arial, sans-serif";

    popup.innerHTML = `
  <h3 style="margin-bottom: 10px; color: #FA9858; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);">LexiShift</h3>
  <p style="margin: 5px 0;"><strong>Word:</strong> ${word}</p>
  <p style="margin: 5px 0;"><strong>Definition:</strong> <span id="wordDefinition">Loading...</span></p>
  <p style="margin: 5px 0;"><strong>Example:</strong> <span id="wordExample">Loading...</span></p>
  <button
    style="
      margin-top: 10px;
      padding: 5px 10px;
      background-color: rgba(255, 255, 255, 0.3);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 8px;
      cursor: pointer;
      backdrop-filter: blur(5px);
      transition: background-color 0.3s ease, color 0.3s ease;
    "
    id="closePopup"
    onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.6)'; this.style.color='#000';"
    onmouseout="this.style.backgroundColor='rgba(255, 255, 255, 0.3)'; this.style.color='#fff';"
  >
    Close
  </button>
`;

    document.body.appendChild(popup);

    document.getElementById("closePopup").addEventListener("click", () => {
      popup.remove();
    });

    document.body.appendChild(popup);
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
        document.getElementById(
          "wordDefinition"
        ).innerText = `Error: ${error.message}`;
        document.getElementById("wordExample").innerText = "N/A";
      });

    // Close the popup when the button is clicked
    document.getElementById("closePopup").addEventListener("click", () => {
      popup.remove();
    });
  }
});
