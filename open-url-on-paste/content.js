// 判断是否为 URL 的正则表达式
const urlRegex = /^(https?:\/\/|www\.)[^\s]+$/;

// 监听粘贴事件
document.addEventListener("paste", (event) => {
  // 获取粘贴的内容
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedText = clipboardData.getData("text");

  // 检查是否为 URL
  if (urlRegex.test(pastedText)) {
    // 如果是 URL，发送消息给 background.js
    const url = pastedText.startsWith("http") ? pastedText : `http://${pastedText}`;
    console.log("Detected URL to open:", url);

    chrome.runtime.sendMessage({ action: "openUrl", url: url }, (response) => {
      if (response && response.status === "success") {
        console.log("URL opened successfully.");
      } else {
        console.error("Failed to open URL.");
      }
    });
  }
});
