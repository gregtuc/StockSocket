"use strict";

import { Browser, Page, launch } from "puppeteer";
var browser: Browser;

//Pages Array
interface IPagesArray {
  [key: string]: Page;
}
var pagesArray: IPagesArray;
pagesArray = {};

//Tickers Array
interface ITickersArray {
  symbol: string;
  price: number;
}
var tickersArray: ITickersArray[];
tickersArray = [];

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
    var tickerObject: ITickersArray = { symbol: tickers[i], price: 0 };
    tickersArray.push(tickerObject);
    startDataFeed(tickersArray[tickersArray.length - 1], callback);
  }
}

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

//Stop data for a specific ticker.
async function removeTicker(ticker: string) {
  for (var key in pagesArray) {
    if (key == ticker) {
      await pagesArray[key].close();
      delete pagesArray[key];
      break;
    }
  }
}

//Stop data for a list of tickers.
async function removeTickers(tickers: Array<string>) {
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

async function startDataFeed(
  ticker: { symbol: string; price: number },
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
      const potentialSelectors: { [key: string]: string } = {
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

  //Take action on the observed price mutation.
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
