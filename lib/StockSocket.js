"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = require("puppeteer");
var browser;
var pagesArray = {};
var tickersArray = [];
function addTickers(tickers, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        //If browser has not been declared, launch it.
        if (browser == undefined) {
            browser = yield puppeteer_1.launch();
        }
        //Format the inputted tickers, add them to tickersArray, begin operations.
        for (var i = 0; i < tickers.length; i++) {
            var tickerObject = { symbol: tickers[i], price: 0 };
            tickersArray.push(tickerObject);
            startDataFeed(tickersArray[tickersArray.length - 1], callback);
        }
    });
}
function addTicker(ticker, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        //If browser has not been declared, launch it.
        if (browser == undefined) {
            browser = yield puppeteer_1.launch();
        }
        //Push the new ticker to tickersArray.
        tickersArray.push({ symbol: ticker, price: 0 });
        //Begin operations on the new ticker.
        startDataFeed(tickersArray[tickersArray.length - 1], callback);
    });
}
//Stop data for a specific ticker.
function removeTicker(ticker) {
    return __awaiter(this, void 0, void 0, function* () {
        for (var key in pagesArray) {
            if (key == ticker) {
                yield pagesArray[key].close();
                delete pagesArray[key];
                break;
            }
        }
    });
}
//Stop data for a list of tickers.
function removeTickers(tickers) {
    return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i < tickers.length; i++) {
            removeTicker(tickers[i]);
        }
    });
}
//Stop data for all tickers.
function removeAllTickers() {
    return __awaiter(this, void 0, void 0, function* () {
        for (var key in pagesArray) {
            yield pagesArray[key].close();
            delete pagesArray[key];
        }
    });
}
function startDataFeed(ticker, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Configure Puppeteer page.
            pagesArray[ticker.symbol] = yield browser.newPage();
            yield pagesArray[ticker.symbol].setBypassCSP(true);
            yield pagesArray[ticker.symbol].setDefaultNavigationTimeout(0);
            yield pagesArray[ticker.symbol].goto(`https://finance.yahoo.com/quote/${ticker.symbol}?p=${ticker.symbol}`);
            yield pagesArray[ticker.symbol].exposeFunction("puppeteerMutationListener", puppeteerMutationListener);
            //Eliminate consent page if outside of North America
            yield pagesArray[ticker.symbol].evaluate(function () {
                try {
                    if (document.querySelector("#consent-page > div > div > div > form > div.wizard-body > div.actions.couple > button")) {
                        var element = document.querySelector("#consent-page > div > div > div > form > div.wizard-body > div.actions.couple > button");
                        element.click();
                        return;
                    }
                }
                catch (e) {
                    console.log(e);
                }
            });
            //Wait for proper page to load.
            yield pagesArray[ticker.symbol].waitForSelector("#quote-header-info");
            //Evaluate the actual page.
            yield pagesArray[ticker.symbol].evaluate(function () {
                var target;
                const potentialSelectors = {
                    premarket: "#quote-header-info > div.Pos\\(r\\) > div.D\\(ib\\) > p > span",
                    regmarket: "#quote-header-info > div.Pos\\(r\\) > div > p > span",
                    postmarket: "#quote-header-info > div.Pos\\(r\\) > div > div > span",
                    crypto: "#quote-header-info > div.D\\(ib\\) > div > div > span",
                };
                //Find correct query selector.
                for (var key in potentialSelectors) {
                    if (document.querySelector(potentialSelectors[key])) {
                        target = document.querySelector(potentialSelectors[key]);
                        break;
                    }
                }
                if (target != undefined) {
                    //Initiatialize mutation observer.
                    var observer = new MutationObserver((mutationsList) => {
                        for (const mutation of mutationsList) {
                            puppeteerMutationListener(mutation.target.textContent);
                        }
                    });
                    //Activate mutation observer.
                    observer.observe(target, {
                        attributes: true,
                        childList: true,
                        characterData: true,
                        subtree: true,
                    });
                }
            });
        }
        catch (err) {
            console.log(err);
        }
        //Take action on the observed price mutation.
        function puppeteerMutationListener(data) {
            var parsedData = data;
            parsedData = parsedData.replace(/\,/g, "");
            parsedData = parseFloat(parsedData);
            if (ticker.price != parsedData) {
                ticker.price = parsedData;
                callback(ticker);
            }
        }
    });
}
module.exports = {
    addTickers,
    addTicker,
    removeTicker,
    removeTickers,
    removeAllTickers,
};
//# sourceMappingURL=StockSocket.js.map