### Install

```sh
npm i border-radius/is-headless
```

### Require

```js
const isHeadless = require('is-headless');
```
or
```js
import isHeadless from 'is-headless';
```

### Use

```js
isHeadless().then(browserIsHeadless => {
    if (browserIsHeadless) {
        window.close();
    }
});
```
