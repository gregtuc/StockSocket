# StockSocket

*Blazing Fast, real-time access to yahoo finance stock data.*


## Installation and QuickStart Guide

> Using npm
 
`npm install StockSocket --save`

```javascript
const StockSocket = require("StockSocket");

StockSocket.start(["TSLA", "NIO", "NNDM", "ETH-USD"], stockPriceChanged);

function stockPriceChanged(data){
  //Do stuff with the data
  console.log(data);
}
```
## How does it work?

* Puppeteer used with MutationObserver in order to scrape data in lightweight fashion from Yahoo.
* Stock Data returned as fast or faster than shown on the physical Yahoo website.
* Only a single HTTP request sent per inputted ticker for the duration of runtime.
