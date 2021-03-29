"use strict";

import { Browser, launch } from "puppeteer";
import { PagesArray, TickerObject, SelectorsArray } from "../types";

var browser: Browser;
var pagesArray: PagesArray = {};
var tickersArray: TickerObject[] = [];

/**
 * Starts data stream for multiple stock symbols.
 *
 * @param tickers - The array of stock symbols
 * @param callback - The method that will be passed the price info
 */
async function addTickers(
  tickers: Array<string>,
  callback: (arg0: object) => void
) {
  //If browser has not been declared, launch it.
  if (browser == undefined) {
    browser = await launch();
  }
  //Format the inputted tickers, add them to tickersArray, begin operations.
  for (var i = 0; i < tickers.length; i++) {
    var tickerObject: TickerObject = { symbol: tickers[i], price: 0 };
    tickersArray.push(tickerObject);
    startDataFeed(tickersArray[tickersArray.length - 1], callback);
  }
}

/**
 * Starts data stream for a single ticker
 *
 * @param ticker - The stock symbol string
 * @param callback - The method that will be passed the price info
 */
async function addTicker(ticker: string, callback: (arg0: object) => void) {
  //If browser has not been declared, launch it.
  if (browser == undefined) {
    browser = await launch();
  }
  //Push the new ticker to tickersArray.
  tickersArray.push({ symbol: ticker, price: 0 });
  //Begin operations on the new ticker.
  startDataFeed(tickersArray[tickersArray.length - 1], callback);
}

/**
 * Stops data stream for a specified stock symbol
 *
 * @param ticker - The stock symbol string
 */
async function removeTicker(ticker: string) {
  for (var key in pagesArray) {
    if (key == ticker) {
      await pagesArray[key].close();
      delete pagesArray[key];
      break;
    }
  }
}

/**
 * Stops data stream for an array of stock symbols
 *
 * @param tickers - The array of stock symbols
 */
async function removeTickers(tickers: Array<string>) {
  for (var i = 0; i < tickers.length; i++) {
    removeTicker(tickers[i]);
  }
}

/**
 * Stops data stream for every stock symbol in tickersArray
 */
async function removeAllTickers() {
  for (var key in pagesArray) {
    await pagesArray[key].close();
    delete pagesArray[key];
  }
}

/**
 * Method that observes price changes and takes action.
 *
 * @remarks
 * This method inserts a mutation observer on Yahoo and watches for changes
 * with respect to the inputted ticker parameter. Each stock symbol inside of
 * tickersArray gets its own headless chromium page opened through puppeteer.
 *
 * @param ticker - The stock symbol string
 * @param callback - The method that will be passed the price info
 */
async function startDataFeed(
  ticker: TickerObject,
  callback: (arg0: object) => void
) {
  try {
    //Configure Puppeteer page.
    pagesArray[ticker.symbol] = await browser.newPage();
    await pagesArray[ticker.symbol].setBypassCSP(true);
    await pagesArray[ticker.symbol].setDefaultNavigationTimeout(0);
    await pagesArray[ticker.symbol].goto(
      `https://finance.yahoo.com/quote/${ticker.symbol}?p=${ticker.symbol}`
    );
    await pagesArray[ticker.symbol].exposeFunction(
      "puppeteerMutationListener",
      puppeteerMutationListener
    );

    //Eliminate consent page if outside of North America
    await pagesArray[ticker.symbol].evaluate(function () {
      try {
        if (
          document.querySelector(
            "#consent-page > div > div > div > form > div.wizard-body > div.actions.couple > button"
          )
        ) {
          var element = document.querySelector(
            "#consent-page > div > div > div > form > div.wizard-body > div.actions.couple > button"
          ) as HTMLElement;
          element.click();

          return;
        }
      } catch (e) {
        console.log(e);
      }
    });

    //Wait for proper page to load.
    await pagesArray[ticker.symbol].waitForSelector("#quote-header-info");

    //Evaluate the actual page.
    await pagesArray[ticker.symbol].evaluate(function () {
      var target;
      const potentialSelectors: SelectorsArray = {
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
  } catch (err) {
    console.log(err);
  }

  /**
   * Returns price data using the callback function.
   *
   * @param data - The raw data being sent from the mutation observer.
   */
  function puppeteerMutationListener(data: string | null) {
    var parsedData: any = data;
    parsedData = parsedData.replace(/\,/g, "");
    parsedData = parseFloat(parsedData);

    if (ticker.price != parsedData) {
      ticker.price = parsedData;
      callback(ticker);
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
