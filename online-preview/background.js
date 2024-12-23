// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "previewFile",
    title: "预览文件",
    contexts: ["link"], // 仅在链接上显示右键菜单
  });
});

// 处理右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "previewFile") {
    const fileUrl = info.linkUrl; // 获取文件链接
    chrome.tabs.create({ url: chrome.runtime.getURL("preview.html") + `?fileUrl=${encodeURIComponent(fileUrl)}` });
  }
});
