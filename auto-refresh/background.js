// 存储需要刷新的 tabId 和间隔时间
const refreshTabs = {};

// 删除旧的右键菜单，防止重复创建
chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: "setAutoRefresh",
    title: "定时刷新",
    contexts: ["all"]
  });
});

// 动态更新右键菜单标题
function updateContextMenu(tabId) {
  const isRefreshing = Boolean(refreshTabs[tabId]);
  chrome.contextMenus.update("setAutoRefresh", {
    title: isRefreshing ? "关闭定时刷新" : "定时刷新"
  });
}

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "setAutoRefresh" && tab) {
    const tabId = tab.id;

    if (refreshTabs[tabId]) {
      // 当前页面已有定时刷新任务，点击关闭
      clearRefresh(tabId);
      updateContextMenu(tabId); // 更新菜单标题
    } else {
      // 当前页面没有定时刷新任务，打开弹窗设置刷新间隔
      chrome.storage.local.set({ selectedTabId: tabId }, () => {
        chrome.action.openPopup();
      });
    }
  }
});

// 设置刷新任务
function setRefresh(tabId, interval) {
  refreshTabs[tabId] = interval;
  chrome.alarms.create(`refresh-${tabId}`, { periodInMinutes: interval / 60000 });
  updateBadge();
  console.log(`设置刷新：Tab ${tabId}, 每 ${interval / 1000} 秒刷新一次`);
}

// 清除刷新任务
function clearRefresh(tabId) {
  if (refreshTabs[tabId]) {
    delete refreshTabs[tabId];
    chrome.alarms.clear(`refresh-${tabId}`);
    updateBadge();
    console.log(`清除刷新：Tab ${tabId}`);
  }
}

// 定时任务触发逻辑
chrome.alarms.onAlarm.addListener((alarm) => {
  const tabId = parseInt(alarm.name.replace("refresh-", ""), 10);
  console.log(`Alarm triggered for tab ${tabId}`);
  if (refreshTabs[tabId]) {
    chrome.tabs.get(tabId, (tab) => {
      if (chrome.runtime.lastError || !tab) {
        console.error(`Tab ${tabId} 不存在或已关闭`);
        clearRefresh(tabId);
      } else {
        chrome.tabs.reload(tabId, { bypassCache: true }, () => {
          if (chrome.runtime.lastError) {
            console.error(`刷新 Tab ${tabId} 时出错：${chrome.runtime.lastError.message}`);
          } else {
            console.log(`Tab ${tabId} 刷新成功`);
          }
        });
      }
    });
  }
});

// Tab 被关闭时移除设置
chrome.tabs.onRemoved.addListener((tabId) => {
  if (refreshTabs[tabId]) {
    console.log(`Tab ${tabId} 被关闭，清除刷新任务`);
    clearRefresh(tabId);
  }
});

// 更新插件图标显示刷新页面数
function updateBadge() {
  const count = Object.keys(refreshTabs).length;
  chrome.action.setBadgeText({ text: count > 0 ? String(count) : "" });
}

// 监听从弹窗发送的消息，设置刷新间隔
chrome.runtime.onMessage.addListener((message) => {
  console.log("Received message:", message); // 日志 1: 确认收到消息

  if (message.action === "setRefresh") {
    const { tabId, interval } = message;

    // 验证参数
    if (!tabId || !interval) {
      console.error("Invalid parameters:", message); // 日志 2: 参数无效
      return;
    }

    setRefresh(tabId, interval);
    updateContextMenu(tabId); // 更新菜单标题
    console.log(`Current refreshTabs:`, refreshTabs); // 日志 3: 打印当前任务列表
  }
});