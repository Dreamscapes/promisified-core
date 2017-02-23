# promisified-core

> Promisified Node.js core modules

## About

This module behaves as a wrapper module around Node.js' builtin modules and provides a Promise-based APIs for all the callback-based functions. So, instead of `fs.readFile('/img.jpg', (err, contents) => {})` you can do `const contents = await fs.readFile('/img.jpg')`.

Currently this module returns [Bluebird][bluebird-home] instances.

### Comparisons to other approaches

There are several other methods which allow you to do Promise-based programming.

- `new Promise()`: Too verbose just to wrap a callback-based function into a Promise
- `Bluebird.fromCallback()`: Works great, but creates unnecessary boilerplate code every time you want to call a callback-based function
- `Bluebird.promisify()` & `Bluebird.promisifyAll()`: Much better, but requires an explicit promisification step. Also the new functions have a different name (`*Async()`)

This module takes a different approach - it provides a fully-functional, no build step required, module which you can install and simply start using. Just prefix your `require` or `import` calls with *promisified-core/* (ie. `import fs from 'promisified-core/fs'` or `import { fs } from 'promisified-core'`) and you are done!

## Usage

All builtin modules are available for importing through this module. You just need to import it from this package:

```js
// ES2015 way
import * as core from 'promisified-core'
import { fs, os, http } from 'promisified-core'
```

```js
// CommonJS way
const core = require('promisified-core')
const fs = require('promisified-core/fs')
const fs = require('promisified-core').fs
```

## Contributing

Looking for suggestions, improvements, bug reports... any kind of contribution is welcome!

## License

This software is licensed under the **BSD-3-Clause License**. See the [LICENSE](LICENSE) file for more information.


[bluebird-home]: http://bluebirdjs.com/docs/getting-started.html
