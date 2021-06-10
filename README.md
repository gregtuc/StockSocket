# StockSocket

_Real-Time Yahoo Finance Stock data._

_This module opens a Websocket connection with Yahoo for reliable, fast, and lightweight market data._

[![npm](https://img.shields.io/npm/v/stocksocket.svg)](https://www.npmjs.com/package/stocksocket)
[![Build Status](https://travis-ci.org/dwyl/esta.svg?branch=master)](https://www.travis-ci.com/github/gregtuc/StockSocket)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/gregtuc/StockSocket/graphs/commit-activity)
[![codecov](https://codecov.io/gh/gregtuc/StockSocket/branch/main/graph/badge.svg?token=06QRW20F5P)](https://codecov.io/gh/gregtuc/StockSocket)
[![npm](https://img.shields.io/npm/dm/stocksocket.svg)](https://www.npmjs.com/package/stocksocket)

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

- Yahoo Finance uses Websockets to transfer stock data when you open their page on your browser.
- This module leverages that functionality by opening its own direct WebSocket connection with Yahoo (skipping the need for the browser in the process).
- As a result, this module is far more lightweight and quick than previous versions of this module (which used Puppeteer and inefficient web-scraping).

## Sample Output
### Pre-Market
```
{
  id: 'TSLA',
  price: 610.0977172851562,
  time: '1623352065000',
  exchange: 'NMS',
  quoteType: 'EQUITY',
  marketHours: 'PRE_MARKET',
  changePercent: 1.8901244401931763,
  change: 11.31768798828125,
  priceHint: '2'
}
```

### Regular Market (Contains Real-Time Volume Updates)
```
{
  id: 'TSLA',
  price: 610.0977172851562,
  time: '1623352065000',
  exchange: 'NMS',
  quoteType: 'EQUITY',
  marketHours: 'REGULAR_MARKET',
  changePercent: 1.8901244401931763,
  dayVolume: '21090676',
  change: 11.31768798828125,
  priceHint: '2'
}
```

### Post-Market
```
{
  id: 'TSLA',
  price: 610.0977172851562,
  time: '1623352065000',
  exchange: 'NMS',
  quoteType: 'EQUITY',
  marketHours: 'POST_MARKET',
  changePercent: 1.8901244401931763,
  change: 11.31768798828125,
  priceHint: '2'
}
```

### Cryptocurrencies
```
{
  id: 'ETH-USD',
  price: 2465.013916015625,
  time: '1623352142000',
  currency: 'USD',
  exchange: 'CCC',
  quoteType: 'CRYPTOCURRENCY',
  marketHours: 'REGULAR_MARKET',
  changePercent: -4.241476535797119,
  dayVolume: '29413464064',
  dayHigh: 2615.832763671875,
  dayLow: 2463.379150390625,
  change: -109.18408203125,
  shortName: 'Ethereum USD',
  lastSize: '29413464064',
  priceHint: '2',
  vol_24hr: '29413464064',
  volAllCurrencies: '29413464064',
  fromcurrency: 'ETH',
  lastMarket: 'CoinMarketCap',
  circulatingSupply: 116236768,
  marketcap: 286525260000
}
```

## Docs

---

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
