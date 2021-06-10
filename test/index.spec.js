var expect = require("chai").expect;
var rewire = require('rewire');
var StockSocket = rewire('../src/StockSocket')

describe('Testing the addTicker and removeTicker methods', function () {
  var primaryTicker = "NIO";
  var secondaryTicker = "ARKK"
  var multipleTickers = ["AMD", "SQ", "ETH-USD"]
  before(function (done) {
    this.timeout(20000);
    StockSocket.addTicker(primaryTicker, callback);
    function callback(data) {
      done();
    }
  });
  after(function (done) {
    this.timeout(20000);
    done();
  })
  it('Inserting an array should return an error', function (done) {
    expect(() => StockSocket.addTicker(multipleTickers)).to.throw(/You can only add one ticker with the addTickers method./);
    done();
  });
  it('Array length matches the number of inserted tickers', function (done) {
    expect(StockSocket.__get__("tickersArray")).to.be.lengthOf(1)
    done();
  });
  it('Inserted ticker value is correct', function (done) {
    expect(StockSocket.__get__("tickersArray")[0]).to.be.equal(primaryTicker);
    done();
  });
  it('Inserting duplicates has no effect', function (done) {
    StockSocket.addTicker(primaryTicker);
    expect(StockSocket.__get__("tickersArray")).to.be.lengthOf(1);
    done();
  });
  it('Ticker was removed from the array', function (done) {
    StockSocket.removeTicker(primaryTicker);
    expect(StockSocket.__get__("tickersArray")).to.be.lengthOf(0);
    done();
  });
  it('Multiple tickers can be inserted individually', function (done) {
    StockSocket.addTicker(primaryTicker);
    expect(StockSocket.__get__("tickersArray")[0]).to.be.equal(primaryTicker)
    StockSocket.addTicker(secondaryTicker);
    expect(StockSocket.__get__("tickersArray")[1]).to.be.equal(secondaryTicker)
    done();
  });
  it('Multiple tickers can be removed individually', function (done) {
    StockSocket.removeTicker(secondaryTicker);
    expect(StockSocket.__get__("tickersArray")[1]).to.be.undefined
    StockSocket.removeTicker(primaryTicker);
    expect(StockSocket.__get__("tickersArray")[0]).to.be.undefined
    done();
  });
  it('Array finishes the test suite as empty', function (done) {
    expect(StockSocket.__get__("tickersArray")).to.be.lengthOf(0);
    done();
  });
});

describe('Testing the addTickers and removeTickers methods', function () {
  var primaryTickers = ["NIO", "SOFI", "MARA"];
  var secondaryTickers = ["CRSP", "LMND", "NOK"];
  var singleTicker = "LYFT"
  before(function (done) {
    this.timeout(20000);
    StockSocket.addTickers(primaryTickers, callback);
    function callback(data) {
      done();
    }
  });
  after(function (done) {
    this.timeout(20000);
    done();
  })
  it('Inserting a non-array should return an error', function (done) {
    expect(() => StockSocket.addTickers(singleTicker)).to.throw(/You must add multiple tickers with the addTickers method./);
    done();
  });
  it('Array length matches the number of inserted tickers', function (done) {
    expect(StockSocket.__get__("tickersArray")).to.be.lengthOf(primaryTickers.length);
    done();
  });
  it('Inserted ticker values are correct', function (done) {
    for (var i = 0; i < primaryTickers.length; i++) {
      expect(StockSocket.__get__("tickersArray")[i]).to.be.equal(primaryTickers[i]);
    }
    done();
  });
  it('Inserting duplicates has no effect', function (done) {
    StockSocket.addTickers(primaryTickers);
    expect(StockSocket.__get__("tickersArray")).to.be.lengthOf(primaryTickers.length);
    done();
  });
  it('Checking the tickers have been removed from the array', function (done) {
    StockSocket.removeTickers(primaryTickers);
    for (var i = 0; i < primaryTickers.length; i++) {
      expect(StockSocket.__get__("tickersArray")[i]).to.be.undefined
    }
    done();
  });
  it('Multiple tickers can be inserted in succession', function (done) {
    StockSocket.addTickers(primaryTickers);
    StockSocket.addTickers(secondaryTickers);
    expect(StockSocket.__get__("tickersArray")).to.be.lengthOf(primaryTickers.length + secondaryTickers.length);
    for (var i = 0; i < primaryTickers.length; i++) {
      expect(StockSocket.__get__("tickersArray")[i]).to.be.equal(primaryTickers[i]);
    }
    for (var i = primaryTickers.length; i < primaryTickers.length + secondaryTickers.length; i++) {
      expect(StockSocket.__get__("tickersArray")[i]).to.be.equal(secondaryTickers[i - primaryTickers.length]);
    }
    done();
  });
  it('Multiple tickers can be removed in succession', function (done) {
    StockSocket.removeTickers(secondaryTickers);
    expect(StockSocket.__get__("tickersArray")).to.be.lengthOf(primaryTickers.length);
    for (var i = 0; i < primaryTickers.length; i++) {
      expect(StockSocket.__get__("tickersArray")[i]).to.be.equal(primaryTickers[i]);
    }
    StockSocket.removeTickers(primaryTickers);
    expect(StockSocket.__get__("tickersArray")).to.be.lengthOf(0);
    done();
  });
  it('Array finishes the test suite as empty', function (done) {
    StockSocket.removeTicker(secondaryTickers);
    expect(StockSocket.__get__("tickersArray")[1]).to.be.undefined
    StockSocket.removeTicker(primaryTickers);
    expect(StockSocket.__get__("tickersArray")[0]).to.be.undefined
    done();
  });
});

describe('Testing the removeAllTickers method', function () {
  var tickers = ["NIO", "SOFI", "MARA", "AMC", "GME"];
  before(function (done) {
    this.timeout(20000);
    StockSocket.addTickers(tickers, callback);
    function callback(data) {
      done();
    }
  });
  after(function (done) {
    this.timeout(20000);
    done();
  })
  it('Array length matches the number of inserted tickers', function (done) {
    expect(StockSocket.__get__("tickersArray")).to.be.lengthOf(tickers.length);
    done();
  });
  it('Checking the tickers have been added to the array', function (done) {
    for (var i = 0; i < tickers.length; i++) {
      expect(StockSocket.__get__("tickersArray")[i]).to.be.equal(tickers[i])
    }
    done();
  });
  it('Checking that all tickers have been removed from the array', function (done) {
    StockSocket.removeAllTickers();
    expect(StockSocket.__get__("tickersArray")).to.be.lengthOf(0);
    done();
  });
});

describe("Testing websocket connection and getting data", function () {
  var wsData;
  var ticker = "TSLA";
  this.beforeAll(function (done) {
    this.timeout(20000);
    StockSocket.addTicker(ticker, callback);
    function callback(data) {
      wsData = data;
      StockSocket.removeAllTickers();
      done();
    }
  });
  afterEach(function (done) {
    this.timeout(20000);
    done();
  });
  it("Data is of type object", function (done) {
    expect(wsData).to.be.an("object");
    done();
  });
  it("Data is greater than length 1", function (done) {
    expect(Object.keys(wsData).length).to.be.greaterThan(1);
    done();
  });
  it("Data object has id property", function (done) {
    expect(wsData.hasOwnProperty("id"));
    done();
  });
  it("Data object has price property", function (done) {
    expect(wsData.hasOwnProperty("price"));
    done();
  });
  it("Data object has time property", function (done) {
    expect(wsData.hasOwnProperty("time"));
    done();
  });
  it("Data object has exchange property", function (done) {
    expect(wsData.hasOwnProperty("exchange"));
    done();
  });
  it("Data object has quoteType property", function (done) {
    expect(wsData.hasOwnProperty("quoteType"));
    done();
  });
  it("Data object has marketHours property", function (done) {
    expect(wsData.hasOwnProperty("marketHours"));
    done();
  });
  it("Data object has changePercent property", function (done) {
    expect(wsData.hasOwnProperty("changePercent"));
    done();
  });
  it(`Checking the id is ${ticker}`, function (done) {
    expect(wsData["id"]).to.be.equal(ticker);
    done();
  });
  it("Checking the price is greater than 1", function (done) {
    expect(wsData["price"]).to.be.greaterThan(1);
    done();
  });
  it("Checking the time is not null", function (done) {
    expect(wsData["time"]).to.not.be.null;
    done();
  });
  it("Checking the exchange is not null", function (done) {
    expect(wsData["exchange"]).to.not.be.null;
    done();
  });
  it("Checking the quoteType is not null", function (done) {
    expect(wsData["quoteType"]).to.not.be.null;
    done();
  });
  it("Checking the marketHours is not null", function (done) {
    expect(wsData["marketHours"]).to.not.be.null;
    done();
  });
  it("Checking the changePercent is not null", function (done) {
    expect(wsData["changePercent"]).to.not.be.null;
    done();
    process.exit(0);
  });
});
