# Stock Socket

_Blazing Fast, real-time access to yahoo finance stock data._

_This module doesn't periodically check for price changes in your tickers -it sends you the price changes the instant they happen._

[![npm](https://img.shields.io/npm/v/stocksocket.svg)](https://www.npmjs.com/package/stocksocket)
[![npm](https://img.shields.io/npm/dm/stocksocket.svg)](https://www.npmjs.com/package/stocksocket)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/gregtuc/StockSocket/graphs/commit-activity)

```javascript
const StockSocket = require("stocksocket");

StockSocket.addTickers(["TSLA", "NIO", "NNDM", "ETH-USD"], stockPriceChanged);

function stockPriceChanged(data) {
  //Choose what to do with your data as it comes in.
  console.log(data);
}
```
                                                                                      ||
                                                                                      ||
                                                                                      \/

<p align="center">
  <img src="https://user-images.githubusercontent.com/60011793/109716940-6f147800-7b73-11eb-8991-fc6f414ba6b7.PNG">
</p>

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install stocksocket
```

## How does it work?

- For each ticker inputted, a single chromium page is opened in headless fashion using Puppeteer.
- Each page has a [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) inserted that checks for price changes on Yahoo.
- Any mutations in the price are sent back to the function passed by the user (you) using a key-value pair format of "ticker" : price.
- Since the MutationObserver collects the data, only a single request is sent per ticker for the duration of runtime! In other words, you aren't hassling Yahoo with large amounts of HTTP requests. 

## Docs


### addTicker(stockticker, callback)
_Start data stream for a specific ticker_

```javascript
var stockticker = "TSLA";

StockSocket.addTicker(stockticker, stockPriceChanged);

function stockPriceChanged(data) {
  console.log(data);
}
```

**stockticker** _(type: `String`)_

String object containing a stock ticker to be added.

**callback** _(type: `Function`)_

Callback Function that receives each price update

---

### addTickers([stocktickers], callback)
_Start data stream for an array of tickers_

```javascript
var stocktickers = ["TSLA", "NNDM", "AAPL", "MARA"];

StockSocket.addTickers(stocktickers, stockPriceChanged);

function stockPriceChanged(data) {
  console.log(data);
}
```

**stocktickers** _(type: `Array`)_

Array of string objects containing the stock tickers

**callback** _(type: `Function`)_

Callback Function that receives each price update

---

### removeTicker(stockticker)
_Stop data stream for a specific ticker._
```javascript
var stockticker = "TSLA";

StockSocket.removeTicker(stockticker);
```

**stockticker** _(type: `String`)_

String object containing a stock ticker to be added.

---

### removeTickers([stocktickers])
_Stop data stream for various tickers_

```javascript
var stocktickers = ["TSLA", "NNDM", "AAPL", "MARA"];

StockSocket.removeTickers(stocktickers);
```

**stocktickers** _(type: `Array`)_

Array of string objects containing the stock tickers to be removed.

---

### removeAllTickers()
_Stop data stream for all tickers_

```javascript
StockSocket.removeAllTickers();
```

---

## License

  [MIT](LICENSE)
