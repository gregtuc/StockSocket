"use strict";
const protobuf = require("./__finStreamer-proto");
const WebSocket = require("isomorphic-ws");
var ws = new WebSocket("wss://streamer.finance.yahoo.com");
var tickersArray = [];

/**
 * Method that adds an array of tickers to the watchlist
 * @param {String[]} tickers An array of strings
 * @param {*} callback
 */
async function addTickers(tickers, callback) {
  if (!Array.isArray(tickers)) {
    throw "You must add multiple tickers with the addTickers method.";
  }
  for (var i = 0; i < tickers.length; i++) {
    removeTicker(tickers[i]);
    tickersArray.push(tickers[i]);
  }
  startDataFeed(callback);
}

/**
 * Method that adds a single ticker to the watchlist
 * @param {String} ticker A string containing a ticker symbol
 * @param {Function} callback A callback method
 */
async function addTicker(ticker, callback) {
  if (Array.isArray(ticker)) {
    throw "You can only add one ticker with the addTickers method.";
  }
  removeTicker(ticker);
  tickersArray.push(ticker);
  startDataFeed(callback);
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
async function startDataFeed(callback) {
  //Close existing connections and re-open with all tickers.
  if (ws.readyState == 1) {
    ws.send("close");
    ws = new WebSocket("wss://streamer.finance.yahoo.com");
  }

  //Format opening message for socket.
  const opening_message = '{"subscribe":' + JSON.stringify(tickersArray) + "}";

  //Sending tickers that will receive Websocket information.
  ws.onopen = function open() {
    console.log("StockSocket has opened a WebSocket Connection with Yahoo.");
    ws.send(opening_message);
  };

  //Receiving, decoding, and transmitting stock data to callback method.
  ws.onmessage = function incoming(data) {
    var buffer = base64ToArray(data.data); // decode from base 64
    var PricingData = protobuf.quotefeeder.PricingData;
    var data = PricingData.decode(buffer); // Decode using protobuff
    data = PricingData.toObject(data, {
      // Convert to a JS object
      enums: String,
    });
    if (tickersArray.indexOf(data.id) != -1) {
      callback(data);
    }
  };

  //Log if the socket is closed.
  ws.onclose = function close() {
    console.log("Socket disconnected.");
  };
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
