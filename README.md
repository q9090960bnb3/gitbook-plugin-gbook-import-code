# gitbook-plugin-gbook-import-code

gitbook plugin support @import "{filename}"

for example:

```md
@import "src/1.go"
```

or 

```md
@import "src/1" {go}
```

## use in book.json

```json
{
  "plugins": ["gbook-import-code"]
}
```