# KOA framework

## how to use

### 0x01 Install dependencies

`npm i`

`### 0x02 Modify configuration

`mv config/env.bac.js config/env.js`
Modify  `config/env.js` to your own configuration

### 0x03 start server

`npm run start`

### generate secretKey

`require('crypto').randomBytes(64).toString('hex')`
[![Run on Repl.it](https://repl.it/badge/github/flyce/Mario)](https://repl.it/github/flyce/Mario)