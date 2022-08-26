const protobuf = require("protobufjs");
const WebSocket = require("isomorphic-ws");
const root = protobuf.loadSync(__dirname + "\\proto\\PricingData.proto");
const Ticker = root.lookupType("ticker");

//nodecache to avoid making buggy custom array implementations
const NodeCache = require("node-cache");
const tickerCache = new NodeCache();

//not const because of frequent re-instantiation in activate function
var ws = new WebSocket("wss://streamer.finance.yahoo.com");

//callback as global variable so that the user doesn't need to re-pass it everytime
var userCallback;

//to verify if the user manually shut down the socket (0 is closed)
var toggle = 0;

/**
 * Method that adds a single ticker to the watchlist
 * @param {String} ticker A string containing a ticker symbol
 */
function addTicker(ticker, callback) {
	var err = checkTickerSyntax(ticker);
	if (err != "") {
		return err;
	}

	if (!tickerCache.has(ticker)) {
		tickerCache.set(ticker, "");
	}

	//If the socket is already open, restart it to account for new tickers
	if (ws.readyState == WebSocket.OPEN) {
		restart();
	}
	start(callback);
}

/**
 * Method that removes a specific ticker from the watchlist
 * @param {string} ticker A string containing a ticker symbol
 */
function removeTicker(ticker) {
	if (tickerCache.has(ticker)) {
		tickerCache.del(ticker);
	}
	//If the socket is already open, restart it to account for removed tickers
	if (ws.readyState == WebSocket.OPEN) {
		restart();
	}
	return;
}

/**
 * Method that adds an array of tickers to the watchlist
 * @param {String[]} tickers An array of strings
 */
async function addTickers(tickers, callback) {
	if (!Array.isArray(tickers)) {
		throw "Tickers must be an array of strings";
	}
	for (let i = 0; i < tickers.length; i++) {
		var err = checkTickerSyntax(tickers[i]);
		if (err != "") {
			return err;
		}

		if (!tickerCache.has(tickers[i])) {
			tickerCache.set(tickers[i], "");
		}
	}

	//If the socket is already open, restart it to account for new tickers
	if (ws.readyState == WebSocket.OPEN) {
		restart();
	}
	start(callback);
}

/**
 * Method that removes an array of tickers from the watchlist
 * @param {String[]} tickers An array of strings
 */
function removeTickers(tickers) {
	if (!Array.isArray(tickers)) {
		return "Tickers must be an array of strings";
	}
	for (let i = 0; i < tickers.length; i++) {
		var err = checkTickerSyntax(tickers[i]);
		if (err != "") {
			return err;
		}

		if (tickerCache.has(tickers[i])) {
			tickerCache.del(tickers[i]);
		}
	}
	//If the socket is already open, restart it to account for removed tickers
	if (ws.readyState == WebSocket.OPEN) {
		restart();
	}
	return;
}

/**
 * Method that removes every element from the tickers watchlist and ends the socket connection
 */
function clear() {
	tickerCache.flushAll();
	if (ws.readyState == WebSocket.OPEN) {
		restart();
	}
}

/**
 * Method that returns the current list of tickers
 * @returns {String[]} An array of strings containing the tickers that are currently subscribed to
 */
function list() {
	return tickerCache.keys();
}

/**
 * Method that starts the websocket connection.
 */
function start(callback) {
	if (!ws) {
		ws = new WebSocket("wss://streamer.finance.yahoo.com");
	}

	if (ws.readyState != WebSocket.OPEN) {
		userCallback = callback;
		toggle = 1;
		activate();
	} else {
		restart();
	}
}

/**
 * Method that terminates the websocket connection.
 */
function stop() {
	if (ws.readyState == WebSocket.OPEN) {
		toggle = 0;
		ws.terminate();
	}
}

/**
 * Method that restarts the websocket connection. Doesn't re-open connection if empty watchlist
 */
function restart() {
	if (ws.readyState == WebSocket.OPEN) {
		toggle = 0;
		ws.terminate();
	}
	if (tickerCache.keys().length > 0) {
		toggle = 1;
		activate();
	}
}

/**
 * Method that starts a Websocket connection with Yahoo Finance for the tickers in the watchlist
 */
function activate() {
	ws = new WebSocket("wss://streamer.finance.yahoo.com");

	ws.onopen = function open() {
		console.log(
			`StockSocket is opening a websocket connection with tickers: ${tickerCache
				.keys()
				.toString()}`
		);
		ws.send(
			JSON.stringify({
				subscribe: tickerCache.keys(),
			})
		);
	};
	ws.onmessage = function incoming(message) {
		var ticker = Ticker.decode(Buffer.from(message.data, "base64")).toJSON();
		userCallback(ticker);
	};
	ws.onclose = function close() {
		console.log("Socket closed");

		//if the user didn't manually shut down the socket, restart the connection
		if (toggle == 1) {
			activate();
		}
	};
}

/**
 * Method that checks if a ticker name is valid
 * @param {String} ticker
 * @returns
 */
function checkTickerSyntax(ticker) {
	if (!ticker) {
		return "Ticker is required";
	}
	if (typeof ticker !== "string") {
		return "Ticker must be a string";
	}
	if (ticker.length === 0) {
		return "Ticker must be a non-empty string";
	}
	return "";
}

module.exports = {
	start,
	stop,
	clear,
	addTicker,
	addTickers,
	removeTicker,
	removeTickers,
	list,
};

/**
 * Method that checks if a ticker name is registered on a yahoo-listed market.
 * @param {String} ticker
 * @returns {boolean} true if the ticker is registered on a yahoo-listed market, otherwise false
 */
/*
async function checkTickerExists(ticker) {
	return new Promise((resolve, reject) => {
		axios
			.get(
				`https://query2.finance.yahoo.com/v1/finance/search?q=${ticker}&quotesCount=1&newsCount=0`
			)
			.then((response) => {
				if (
					response.data.quotes[0] != undefined &&
					String(response.data.quotes[0].symbol).toUpperCase() ===
						ticker.toUpperCase()
				) {
					resolve(true);
				} else {
					resolve(false);
				}
			})
			.catch((error) => {
				resolve(error);
			});
	});
}
*/
