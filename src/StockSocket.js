const protobuf = require("protobufjs");
const root = protobuf.loadSync(__dirname + "/PricingData.proto");
const Ticker = root.lookupType("ticker");

const WebSocket = require("isomorphic-ws");
var ws = new WebSocket("wss://streamer.finance.yahoo.com");
var tickersArray = [];

/**
 * Method that adds an array of tickers to the watchlist
 * @param {String[]} tickers An array of strings
 * @param {*} callback
 */
function addTickers(tickers, callback) {
  if (!Array.isArray(tickers)) {
    throw "You must add multiple tickers with the addTickers method.";
  } else {
    for (var i = 0; i < tickers.length; i++) {
      if (!tickersArray.includes(tickers[i])) {
        tickersArray.push(tickers[i]);
      }
    }
    startDataFeed(callback);
  }
}

/**
 * Method that adds a single ticker to the watchlist
 * @param {String} ticker A string containing a ticker symbol
 * @param {Function} callback A callback method
 */
function addTicker(ticker, callback) {
  if (Array.isArray(ticker)) {
    throw "You can only add one ticker with the addTickers method.";
  } else {
    if (!tickersArray.includes(ticker)) {
      tickersArray.push(ticker);
      startDataFeed(callback);
    }
  }
}

/**
 * Method that removes a specific ticker from the watchlist
 * @param {string} ticker A string containing a ticker symbol
 */
function removeTicker(ticker) {
  for (var i = 0; i < tickersArray.length; i++) {
    if (tickersArray[i] == ticker) {
      tickersArray.splice(i, 1);
    }
  }
}

/**
 * Method that removes an array of tickers from the watchlist
 * @param {String[]} tickers An array of strings
 */
function removeTickers(tickers) {
  for (var i = 0; i < tickers.length; i++) {
    for (var j = 0; j < tickersArray.length; j++) {
      if (tickersArray[j] == tickers[i]) {
        tickersArray.splice(j, 1);
      }
    }
  }
}

/**
 * Method that removes every element from the tickers watchlist
 */
function removeAllTickers() {
  tickersArray = [];
}

/**
 * Method that initiates a websocket with Yahoo.
 * @param {Object} input A string or array of strings
 * @param {Function} callback A callback method
 */
function startDataFeed(callback) {
  if (ws.readyState == 1) {
    ws.send("close");
    ws = new WebSocket("wss://streamer.finance.yahoo.com");
  }

  ws.onopen = function open() {
    console.log("StockSocket has opened a WebSocket Connection with Yahoo.");
    ws.send('{"subscribe":' + JSON.stringify(tickersArray) + "}");
  };

  ws.onmessage = function incoming(data) {
    let decodedData = Ticker.decode(Buffer.from(data.data, "base64")).toJSON();
    if (tickersArray.indexOf(decodedData.id) != -1) {
      callback(decodedData);
    }
  };

  ws.onclose = function close() {
    console.log("Socket disconnected.");
  };
}

module.exports = {
  addTickers,
  addTicker,
  removeTicker,
  removeTickers,
  removeAllTickers
};
