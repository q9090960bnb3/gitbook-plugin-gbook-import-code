const fs = require("fs");
const PathUtil = require("path");

function replaceContent(rawPath, textData) {
  // 将文本数据分割成行
  const lines = textData.split("\n");

  rawPath = PathUtil.dirname(rawPath);

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("@import")) {
      const filePath = lines[i].match(/@import "([^"]+)"/);
      if (filePath) {
        const importPath = PathUtil.isAbsolute(filePath[1])
          ? filePath[1]
          : rawPath + "/" + filePath[1];

        const extName = PathUtil.extname(importPath).slice(1);
        // console.info("path: ", importPath, "extName: ", extName);

        // 读取文件内容
        try {
          const fileContent = fs.readFileSync(importPath, "utf8");
          // 替换@import行为文件内容
          lines[i] = "```" + extName + "\n" + fileContent + "```\n";
        } catch (err) {
          console.error(`无法读取文件: ${err}`);
        }
      }
    }
  }

  // 重新将文本数据合并成字符串
  textData = lines.join("\n");

  return textData;
}

module.exports = {
  // Map of hooks
  hooks: {
    "page:before": async (page) => {
      page.content = replaceContent(page.rawPath, page.content);

      return page;
    },
  },
  // Map of new blocks
  blocks: {},
  // Map of new filters
  filters: {},
};
