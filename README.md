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
![readme-sample](https://user-images.githubusercontent.com/60011793/109716447-e72e6e00-7b72-11eb-904e-3eaa36629207.PNG)

## How does it work?

* Puppeteer used with MutationObserver in order to scrape data in lightweight fashion from Yahoo.
* Stock Data returned as fast or faster than shown on the physical Yahoo website.
* Only a single HTTP request sent per inputted ticker for the duration of runtime.
