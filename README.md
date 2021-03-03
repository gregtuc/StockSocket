# Stock Socket

_Blazing Fast, real-time access to yahoo finance stock data._

_This module doesn't periodically check for price changes in your tickers -it sends you the price changes the instant they happen._

[![npm](https://img.shields.io/npm/v/stocksocket.svg)](https://www.npmjs.com/package/stocksocket)
[![npm](https://img.shields.io/npm/dm/stocksocket.svg)](https://www.npmjs.com/package/stocksocket)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/gregtuc/StockSocket/graphs/commit-activity)

## Installation

> Using npm
`npm install StockSocket --save`

## QuickStart

**Code**

```javascript
const StockSocket = require("stocksocket");

StockSocket.addTickers(["TSLA", "NIO", "NNDM", "ETH-USD"], stockPriceChanged);

//Callback method
function stockPriceChanged(data) {
  //Choose what to do with your data as it comes in.
  console.log(data);
}
```

**Output**

<p align="left">
  <img src="https://user-images.githubusercontent.com/60011793/109716940-6f147800-7b73-11eb-8991-fc6f414ba6b7.PNG">
</p>

## Documentation

```javascript
//Start sending stock data for a list of tickers to the callback.
StockSocket.addTickers([stocktickers], callback);
```

**stocktickers** _(type: `Array`)_

Array of objects containing the stock tickers

---

**callback** _(type: `Function`)_

Callback Function that receives each price update

---

```javascript
//Start sending stock data for a specific ticker to the callback.
StockSocket.addTicker(stockticker, callback);
```

**stockticker** _(type: `String`)_

String object containing a stock ticker to be added.

---

**callback** _(type: `Function`)_

Callback Function that receives each price update

---

## How does it work?

- Puppeteer used with MutationObserver in order to scrape data in lightweight fashion from Yahoo.
- Stock Data returned as fast or faster than shown on the physical Yahoo website.
- Only a single HTTP request sent per inputted ticker for the duration of runtime.
