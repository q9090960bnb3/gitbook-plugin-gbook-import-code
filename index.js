const fs = require("fs");
const PathUtil = require("path");

function getInfo(str) {
  if (/^\w+$/.test(str)) {
    return {
      lang: str,
      dbe: false // double braces escape
    }
  }

  let validStr = str.replace(/([a-zA-Z_$][0-9a-zA-Z_$]*)\s*:/g, '"$1": ');
  validStr = validStr.replace(/'/g, '"');
  return JSON.parse("{" + validStr + "}")
}

/**
 * 
 * @param {string} rawPath 
 * @param {string} textData 
 * @returns 
 */
function replaceContent(rawPath, textData) {
  // 将文本数据分割成行
  const lines = textData.split("\n");

  rawPath = PathUtil.dirname(rawPath);

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("@import")) {
      const res = lines[i].match(/@import "([^"]+)"[ \t]*(?:{(.+)})?/)
      if (res) {
        const importPath = PathUtil.isAbsolute(res[1])
          ? res[1]
          : rawPath + "/" + res[1];

        let extName = PathUtil.extname(importPath).slice(1);
        let otherInfo = ""
        let dbe = false
        if (res[2]) {
          // console.log('res2:', res[2])
          const info = getInfo(res[2])
          if (info.lang) {
            extName = info.lang
          }
          if (info.dbe){
            dbe = true
          }
          otherInfo = JSON.stringify(info)
        }

        // console.info("path: ", importPath, "extName: ", extName);

        // 读取文件内容
        try {
          var fileContent = fs.readFileSync(importPath, "utf8");

          if (!fileContent.endsWith("\n")) {

            // fileContent = encodeURIComponent(fileContent)
            fileContent += "\n"
          }

          // 替换@import行为文件内容
          let line = "```" + extName + " " + otherInfo + "\n" + fileContent + "```\n";
          if (dbe) {
            line = `{% raw %}\n${line}{% endraw %}\n`
          }
          lines[i] = line
          // console.log('lines:', lines[i])
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
