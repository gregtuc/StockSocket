"use strict";
var protobuf = require("./__finStreamer-proto");
const WebSocket = require("ws");
var tickersArray = [];

/**
 * Method that adds an array of tickers to the watchlist
 * @param {String[]} tickers An array of strings
 * @param {*} callback
 */
async function addTickers(tickers, callback) {
  for (var i = 0; i < tickers.length; i++) {
    tickersArray.push(tickers[i]);
  }
  startDataFeed(tickers, callback);
}

/**
 * Method that adds a single ticker to the watchlist
 * @param {String} ticker A string containing a ticker symbol
 * @param {Function} callback A callback method
 */
async function addTicker(ticker, callback) {
  tickersArray.push(ticker);
  startDataFeed(ticker, callback);
}

/**
 * Method that removes a specific ticker from the watchlist
 * @param {string} ticker A string containing a ticker symbol
 */
async function removeTicker(ticker) {
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
async function removeTickers(tickers) {
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
async function removeAllTickers() {
  for (var i = 0; i < tickersArray.length; i++) {
    tickersArray.splice(i, 1);
  }
}

/**
 * Method that initiates a websocket with Yahoo.
 * @param {Object} input A string or array of strings
 * @param {Function} callback A callback method
 */
async function startDataFeed(input, callback) {
  //Formatting if only one ticker was inputted.
  if (!Array.isArray(input)) {
    input = [input];
  }
  const opening_message = '{"subscribe":' + JSON.stringify(input) + "}";

  //Creating a new Websocket element.
  const ws = new WebSocket("wss://streamer.finance.yahoo.com", null, {
    origin: "https://ca.finance.yahoo.com",
  });

  //Sending tickers that will receive Websocket information.
  ws.on("open", function open() {
    console.log("StockSocket has opened a WebSocket Connection with Yahoo.");
    ws.send(opening_message);
  });

  //Receiving, decoding, and transmitting stock data to callback method.
  ws.on("message", function incoming(data) {
    var buffer = base64ToArray(data); // decode from base 64
    var PricingData = protobuf.quotefeeder.PricingData;
    var data = PricingData.decode(buffer); // Decode using protobuff
    data = PricingData.toObject(data, {
      // Convert to a JS object
      enums: String,
    });
    if (tickersArray.indexOf(data.id) != -1) {
      callback(data);
    }
  });
}

/**
 * Helper function to convert a base 64 string into a bytes array
 * @param {String} base64 a string in base 64
 */
function base64ToArray(base64) {
  var binaryString = atob(base64);
  var len = binaryString.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Helper function to convert an encoded string into base64
 * @param {String} str An encoded string
 */
function atob(str) {
  return Buffer.from(str, "base64").toString("binary");
}

module.exports = {
  addTickers,
  addTicker,
  removeTicker,
  removeTickers,
  removeAllTickers,
};
