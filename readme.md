## json-configure

> all sync action

## usage

```
const jsonConfigure = require("json-configure");

jsonConfigure.write('name', 'zwkang');


console.log(jsonConfigure.read('name'));
// zwkang


jsonConfigure.clear // remove save file
jsonConfigure.clearCache // remove cache

```

---

## LICENSE

[MIT](./LICENSE)
