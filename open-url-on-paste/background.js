chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openUrl") {
    console.log("Background received URL:", request.url);
    chrome.tabs.create({ url: request.url }, () => {
      sendResponse({ status: "success" });
    });
    // 必须返回 true，才能异步响应
    return true;
  }
});
