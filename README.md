# Stock Socket

_High-Speed, Real-Time Yahoo Finance stock data._

_This module opens a Websocket connection with Yahoo for reliable, fast, and lightweight market data._

[![npm](https://img.shields.io/npm/v/stocksocket.svg)](https://www.npmjs.com/package/stocksocket)
[![npm](https://img.shields.io/npm/dm/stocksocket.svg)](https://www.npmjs.com/package/stocksocket)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/gregtuc/StockSocket/graphs/commit-activity)

```javascript
const StockSocket = require("stocksocket");

StockSocket.addTicker("TSLA", stockPriceChanged);

function stockPriceChanged(data) {
  //Choose what to do with your data as it comes in.
  console.log(data);
}
```

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

- 
- Yahoo Finance uses Websockets to transfer stock data when you open their page on your browser.
- This module leverages that functionality by opening its own direct WebSocket connection with Yahoo.
- The WebSocket connection bypasses the need to open your browser (or inefficiently Web-scrape data) and gets direct data.
- As a result, this module is far more lightweight and quick than previous versions of this module (which used Puppeteer).

## Sample Output
<p align="left">
  <img src="https://user-images.githubusercontent.com/60011793/113175305-49819980-9219-11eb-9ecd-a2bb9108478a.png">
</p>

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
