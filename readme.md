# json-configure

> description:

sync use config file

## Features

- long cache file
- sync write/read.

## Try it now

```
import { Configure } from 'json-configure';

const config = new Configure();

config.write('name', 'zwkang');

console.log(jsonConfigure.read('name'));
// zwkang


jsonConfigure.clear // remove save file
jsonConfigure.clearCache // remove cache

```

## LICENSE

[MIT](./LICENSE) License © 2022 [zwkang](https://github.com/zwkang)
