# StockSocket

*Blazing Fast, real-time access to yahoo finance stock data.*


## Installation and QuickStart Guide

> Using npm
 
`npm install StockSocket --save`

```javascript
const StockSocket = require("StockSocket");

StockSocket.start(["TSLA", "NIO", "NNDM", "ETH-USD"], stockPriceChanged);

//Method to be called with each change in price for any of the tickers. You choose what to do with it!
function stockPriceChanged(data){
  console.log(data);
}
```
## How does it work?

* Puppeteer used with MutationObserver in order to scrape data in lightweight fashion from Yahoo.
* Stock Data returned as fast or faster than shown on the physical Yahoo website.
* Only a single HTTP request sent per inputted ticker for the duration of runtime.
