chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "draw",
    title: "右键画图",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "draw") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["drawing.js"]
    });
  }
});
