# StockSocket

*Blazing Fast, real-time access to yahoo finance stock data.


## Installation

> Using npm
 
`npm install StockSocket --save`

## Quick Start Guide
```javascript
const StockSocket = require("StockSocket");

StockSocket.start(["TSLA", "NIO", "NNDM", "ETH-USD"], stockPriceChanged);

function stockPriceChanged(data){
  //Do stuff with the data
  console.log(data);
}
```
