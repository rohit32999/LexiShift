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
    popup.style.width = "340px";
    popup.style.background = "rgba(255, 255, 255, 0.1)"; // Transparent white
    popup.style.border = "1px solid rgba(255, 255, 255, 0.3)"; // Light border
    popup.style.backdropFilter = "blur(12px)"; // Blur effect
    popup.style.color = "#333";
    popup.style.padding = "20px";
    popup.style.borderRadius = "18px"; // Rounded corners
    popup.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.25)"; // Soft shadow
    popup.style.zIndex = "10000";
    popup.style.fontFamily = "Arial, sans-serif";
    popup.style.transition = "all 0.3s ease-in-out";

    popup.innerHTML = `
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <h3 style="margin: 0; color: #FA9858; font-size: 18px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">📚 LexiShift</h3>
      <button id="closePopup" style="
        padding: 5px 12px;
        background: #FA9858;
        color: #fff;
        border: none;
        border-radius: 12px;
        font-size: 12px;
        cursor: pointer;
        transition: background 0.3s ease;">
        Close
      </button>
    </div>

    <div style="display: flex; flex-direction: column; gap: 10px;">

      <!-- Word Box -->
      <div style="
        background: rgba(255, 255, 255, 0.3);
        padding: 12px;
        border-radius: 12px;
        border-left: 4px solid #FA9858;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      ">
        <p style="margin: 0; font-size: 14px;"><strong>🔤 Word:</strong></p>
        <p style="margin: 5px 0 0; color: #333; font-size: 15px;" id="wordText">${word}</p>
      </div>

      <!-- Definition Box -->
      <div style="
        background: rgba(255, 255, 255, 0.3);
        padding: 12px;
        border-radius: 12px;
        border-left: 4px solid #5E9FFF;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      ">
        <p style="margin: 0; font-size: 14px;"><strong>💡 Definition:</strong></p>
        <p style="margin: 5px 0 0; color: #555; font-size: 15px;" id="wordDefinition">Loading...</p>
      </div>

      <!-- Example Box -->
      <div style="
        background: rgba(255, 255, 255, 0.3);
        padding: 12px;
        border-radius: 12px;
        border-left: 4px solid #8BC34A;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      ">
        <p style="margin: 0; font-size: 14px;"><strong>📖 Example:</strong></p>
        <p style="margin: 5px 0 0; color: #777; font-size: 15px;" id="wordExample">Loading...</p>
      </div>

    </div>
`;

    document.body.appendChild(popup);

    document.getElementById("closePopup").addEventListener("click", () => {
      popup.style.opacity="0";
      setTimeout(()=>popup.remove(),300);
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
  }
});
