# Stock Socket
*Blazing Fast, real-time access to yahoo finance stock data.*

*This module doesn't periodically check for price changes in your tickers, it sends you the changes the instant they happen*

## Installation

> Using npm
> 
`npm install StockSocket --save`

## QuickStart

### Code

```javascript
const StockSocket = require("stocksocket");

StockSocket.start(["TSLA", "NIO", "NNDM", "ETH-USD"], stockPriceChanged);

//Callback method
function stockPriceChanged(data){
  //Choose what to do with your data as it comes in.
  console.log(data);
}
```
### Output

<p align="left">
  <img src="https://user-images.githubusercontent.com/60011793/109716940-6f147800-7b73-11eb-8991-fc6f414ba6b7.PNG">
</p>

## Documentation
```javascript
StockSocket.start([stocktickers], callback)
```

**stocktickers** *(type: `Array`)*

Array of objects containing the stock tickers

**callback** *(type: `Function`)*

Callback Function that receives each price update

## How does it work?

* Puppeteer used with MutationObserver in order to scrape data in lightweight fashion from Yahoo.
* Stock Data returned as fast or faster than shown on the physical Yahoo website.
* Only a single HTTP request sent per inputted ticker for the duration of runtime.
