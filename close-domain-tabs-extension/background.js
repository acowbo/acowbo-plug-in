chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: "close-same-domain-tabs",
            title: "关闭所有同域名的标签页（保留当前页）",
            contexts: ["all"] // 在所有上下文中显示
        }, () => {
            if (chrome.runtime.lastError) {
                console.error("右键菜单创建失败:", chrome.runtime.lastError.message);
            } else {
                console.log("右键菜单创建成功");
            }
        });
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "close-same-domain-tabs" && tab && tab.url) {
        try {
            const currentDomain = new URL(tab.url).hostname;

            chrome.tabs.query({}, (tabs) => {
                let closedTabs = 0;

                tabs.forEach((t) => {
                    try {
                        const tabDomain = new URL(t.url).hostname;
                        if (tabDomain === currentDomain && t.id !== tab.id) {
                            chrome.tabs.remove(t.id);
                            closedTabs++;
                        }
                    } catch (e) {
                        console.warn(`无法解析标签页 URL: ${t.url}`, e);
                    }
                });

                console.log(`已关闭 ${closedTabs} 个同域名的标签页。`);
            });
        } catch (e) {
            console.error("URL 解析错误:", e);
        }
    } else {
        console.warn("无法执行操作，标签页或 URL 无效。");
    }
});