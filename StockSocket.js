"use strict";
const puppeteer = require("puppeteer");

var browser;
var tickersArray = [];
var pagesArray = {};

async function addTickers(tickers, callbackFunc) {
  //If browser has not been declared, launch it.
  if (browser == undefined) {
    browser = await puppeteer.launch();
  }
  //Format the inputted tickers and add them to tickersArray.
  for (var i = 0; i < tickers.length; i++) {
    tickersArray.push({ symbol: tickers[i], price: 0 });
  }
  //Begin operations on each ticker in tickersArray.
  for (var i = 0; i < tickersArray.length; i++) {
    startDataFeed(tickersArray[i], callbackFunc);
  }
}

async function addTicker(ticker, callbackFunc) {
  //If browser has not been declared, launch it.
  if (browser == undefined) {
    browser = await puppeteer.launch();
  }

  //Push the new ticker to tickersArray.
  tickersArray.push({ symbol: ticker, price: 0 });

  //Begin operations on the new ticker.
  startDataFeed(tickersArray[tickersArray.length - 1], callbackFunc);
}

//Stop data for a specific ticker.
async function removeTicker(ticker) {
  for (var key in pagesArray) {
    if (key == ticker) {
      await pagesArray[key].close();
      delete pagesArray[key];
      break;
    }
  }
}

//Stop data for a list of tickers.
async function removeTickers(tickers) {
  for (var i = 0; i < tickers.length; i++) {
    removeTicker(tickers[i]);
  }
}

//Stop data for all tickers.
async function removeAllTickers() {
  for (var key in pagesArray) {
    await pagesArray[key].close();
    delete pagesArray[key];
  }
}

async function startDataFeed(ticker, callbackFunc) {
  try {
    //Configure Puppeteer page.
    pagesArray[ticker.symbol] = await browser.newPage();
    await pagesArray[ticker.symbol].setBypassCSP(true);
    await pagesArray[ticker.symbol].goto(
      `https://ca.finance.yahoo.com/quote/${ticker.symbol}?p=${ticker.symbol}`
    );
    await pagesArray[ticker.symbol].exposeFunction(
      "puppeteerMutationListener",
      puppeteerMutationListener
    );

    //Evaluate the page.
    await pagesArray[ticker.symbol].evaluate(function () {
      var target;
      const potentialSelectors = {
        premarket:
          "#quote-header-info > div.Pos\\(r\\) > div.D\\(ib\\) > p > span",
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
    });
  } catch (err) {
    console.log(err);
  }

  //Take action on the observed price mutation.
  function puppeteerMutationListener(data) {
    if (ticker.price != data) {
      ticker.price = data;
      callbackFunc(ticker);
    }
  }
}

module.exports = {
  addTickers,
  addTicker,
  removeTicker,
  removeTickers,
  removeAllTickers,
};
