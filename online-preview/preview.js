const urlParams = new URLSearchParams(window.location.search);
const fileUrl = urlParams.get('fileUrl');
const fileExtension = fileUrl.split('.').pop().toLowerCase();

if (fileUrl) {
  if (fileExtension === 'xls' || fileExtension === 'xlsx') {
    // 处理 Excel 文件
    fetch(fileUrl)
      .then(response => response.arrayBuffer())
      .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // 获取第一个工作表
        const worksheet = workbook.Sheets[sheetName];
        const html = XLSX.utils.sheet_to_html(worksheet, {
          header: 1,
          skipHeader: false,
          id: 'excelTable', // 为表格添加 ID
        });
        document.getElementById('excelContent').innerHTML = html; // 将 HTML 渲染到页面
      })
      .catch(error => {
        document.getElementById('excelContent').textContent = '无法加载 Excel 文件';
      });
  } else {
    // 处理文本文件，如 Java、Python、HTML、Vue 等
    fetch(fileUrl)
      .then(response => response.text())
      .then(data => {
        const fileTypeMapping = {
          'java': 'language-java',
          'py': 'language-python',
          'vue': 'language-markup',
          'html': 'language-html',
          'xml': 'language-markup',
          'js': 'language-javascript',
          'json': 'language-json',
          'css': 'language-css',
          'txt': 'language-none',
        };
        const languageClass = fileTypeMapping[fileExtension] || 'language-none';
        const fileContentElement = document.getElementById('fileContent');
        fileContentElement.className = languageClass;
        fileContentElement.textContent = data; // 设置文件内容
        Prism.highlightElement(fileContentElement); // 应用代码高亮
      })
      .catch(error => {
        document.getElementById('fileContent').textContent = '无法加载文件内容';
      });
  }
}