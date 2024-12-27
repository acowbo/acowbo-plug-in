document.addEventListener("DOMContentLoaded", () => {
  const intervals = [1, 3, 5, 10, 15, 30, 60]; // 刷新时间选项（分钟）
  const list = document.getElementById("intervals");

  // 动态生成选项按钮
  intervals.forEach((minutes) => {
    const button = document.createElement("button");
    button.textContent = `${minutes} 分钟`;
    button.onclick = () => setRefreshInterval(minutes);
    list.appendChild(button);
  });

  function setRefreshInterval(minutes) {
    chrome.storage.local.get("selectedTabId", ({ selectedTabId }) => {
      if (selectedTabId) {
        const intervalMs = minutes * 60 * 1000;

        // 将刷新间隔发送给后台脚本
        chrome.runtime.sendMessage({ action: "setRefresh", tabId: selectedTabId, interval: intervalMs });

        // 关闭弹窗
        window.close();
      }
    });
  }
});
