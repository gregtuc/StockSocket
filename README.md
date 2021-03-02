# stocksocket

*Blazing Fast, real-time access to yahoo finance stock data.*


## Installation

> Using npm
> 
`npm install StockSocket --save`

## QuickStart

### Code

```javascript
const StockSocket = require("stocksocket");

StockSocket.start(["TSLA", "NIO", "NNDM", "ETH-USD"], stockPriceChanged);

//Method to be called with each change in price for any of the tickers. You choose what to do with it!
function stockPriceChanged(data){
  console.log(data);
}
```
### Output

<p align="center">
  <img src="https://user-images.githubusercontent.com/60011793/109716940-6f147800-7b73-11eb-8991-fc6f414ba6b7.PNG">
</p>

## How does it work?

* Puppeteer used with MutationObserver in order to scrape data in lightweight fashion from Yahoo.
* Stock Data returned as fast or faster than shown on the physical Yahoo website.
* Only a single HTTP request sent per inputted ticker for the duration of runtime.
