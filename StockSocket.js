"use strict";
const puppeteer = require("puppeteer");

//So-called Global Variables.
var globaltickers = [];

async function start(tickers, callbackFunc) {
  //Organize global tickers.
  for (var i = 0; i < tickers.length; i++) {
    globaltickers.push({ ticker: tickers[i], price: 0 });
  }

  //Launch puppeteer and mutation observers for each ticker.
  for (var i = 0; i < globaltickers.length; i++) {
    startDataFeed(globaltickers[i], callbackFunc);
  }
}

async function addTicker(ticker, callbackFunc) {
  globaltickers.push({ ticker: ticker, price: 0 });
  startDataFeed(globaltickers[globaltickers.length - 1], callbackFunc);
}

async function startDataFeed(globalticker, callbackFunc) {
  try {
    //Configure Puppeteer.
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    var url = `https://ca.finance.yahoo.com/quote/${globalticker.ticker}?p=${globalticker.ticker}`;
    await page.setBypassCSP(true);
    await page.goto(url);
    await page.exposeFunction(
      "puppeteerMutationListener",
      puppeteerMutationListener
    );

    //Evaluate the page.
    await page.evaluate(function () {
      var target;
      const potentialSelectors = [
        "#quote-header-info > div.Pos\\(r\\) > div.D\\(ib\\) > p > span",
        "#quote-header-info > div.Pos\\(r\\) > div > p > span",
        "#quote-header-info > div.Pos\\(r\\) > div > div > span",
        "#quote-header-info > div.D\\(ib\\) > div > div > span",
      ];

      //Find correct query selector.
      for (var i = 0; i < potentialSelectors.length; i++) {
        if (document.querySelector(potentialSelectors[i])) {
          target = document.querySelector(potentialSelectors[i]);
          break;
        }
      }

      //Initiate mutation observer.
      new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          console.log(mutation);
          puppeteerMutationListener(mutation.target.textContent);
        }
      }).observe(target, {
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
    if (globalticker.price != data) {
      globalticker.price = data;
      callbackFunc(globalticker);
    }
  }
}

module.exports = { start, addTicker };
