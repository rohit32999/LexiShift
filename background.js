chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "getMeaning",
    title: "Get Meaning of '%s'",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "getMeaning" && info.selectionText) {
    fetchMeaning(tab, info.selectionText);
  }
});

// Handle keyboard shortcut command
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "get-word-meaning") {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    const injectionResults = await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: () => {
        const selectedText = window.getSelection().toString();
        return selectedText || null;
      },
    });
    const selectedText = injectionResults[0]?.result;
    if (selectedText) {
      fetchMeaning(activeTab, selectedText);
    } else {
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => alert("Please highlight a word to find its meaning."),
      });
    }
  }
});

// Function to inject content.js and fetch meaning
async function fetchMeaning(tab, word) {
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
  chrome.tabs.sendMessage(tab.id, { action: "showMeaning", word: word });
}
