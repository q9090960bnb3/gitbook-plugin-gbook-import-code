# gitbook-plugin-gbook-import-code

gitbook plugin support @import "{filename}"

for example:

- 普通使用

```md
@import "src/1.go"
``` 

- 指定文件类型

```md
@import "src/1" "{go}"
```

or

```md
@import "src/1" "{lang: 'go'}"
```

- 配合 gbook-codetab 使用, 将2段代码合并为一组

```md
@import "src/1.js" "{title: 'demo', group: 'group01'}"
@import "src/2.js" "{group: 'group01'}"
@import "src/1.html" "{dbe: true}"
```

## use in book.json

```json
{
  "plugins": ["gbook-import-code"]
}
```