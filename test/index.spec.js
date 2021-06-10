var expect = require("chai").expect;
var StockSocket = require("../src/StockSocket");

describe("UT Suite checking Yahoo Socket Connection & Response", function () {
  var wsData;

  this.beforeAll(function (done) {
    this.timeout(20000);

    StockSocket.addTicker("TSLA", stockPriceChanged);

    function stockPriceChanged(data) {
      wsData = data;
      StockSocket.removeAllTickers();
      done();
    }
  });

  afterEach(function (done) {
    this.timeout(20000);
    done();
  });

  describe("Websocket Connection and Response Tests", function () {
    it("Data is of type object", function (done) {
      this.timeout(20000);
      expect(wsData).to.be.an("object");

      done();
    });

    it("Data is greater than length 1", function (done) {
      this.timeout(20000);
      expect(Object.keys(wsData).length).to.be.greaterThan(1);

      done();
    });
    it("Data object has id property", function (done) {
      this.timeout(20000);
      expect(wsData.hasOwnProperty("id"));

      done();
    });
    it("Data object has price property", function (done) {
      this.timeout(20000);
      expect(wsData.hasOwnProperty("price"));

      done();
    });
    it("Data object has time property", function (done) {
      this.timeout(20000);
      expect(wsData.hasOwnProperty("time"));

      done();
    });
    it("Data object has exchange property", function (done) {
      this.timeout(20000);
      expect(wsData.hasOwnProperty("exchange"));

      done();
    });
    it("Data object has quoteType property", function (done) {
      this.timeout(20000);
      expect(wsData.hasOwnProperty("quoteType"));

      done();
    });
    it("Data object has marketHours property", function (done) {
      this.timeout(20000);
      expect(wsData.hasOwnProperty("marketHours"));

      done();
    });
    it("Data object has changePercent property", function (done) {
      this.timeout(20000);
      expect(wsData.hasOwnProperty("changePercent"));

      done();
    });
    it("Checking the id is TSLA", function (done) {
      this.timeout(20000);
      expect(wsData["id"]).to.be.equal("TSLA");

      done();
    });
    it("Checking the price is greater than 1", function (done) {
      this.timeout(20000);
      expect(wsData["price"]).to.be.greaterThan(1);

      done();
    });
    it("Checking the time is not null", function (done) {
      this.timeout(20000);
      expect(wsData["time"]).to.not.be.null;

      done();
    });
    it("Checking the exchange is not null", function (done) {
      this.timeout(20000);
      expect(wsData["exchange"]).to.not.be.null;

      done();
    });
    it("Checking the quoteType is not null", function (done) {
      this.timeout(20000);
      expect(wsData["quoteType"]).to.not.be.null;

      done();
    });
    it("Checking the marketHours is not null", function (done) {
      this.timeout(20000);
      expect(wsData["marketHours"]).to.not.be.null;

      done();
    });
    it("Checking the changePercent is not null", function (done) {
      this.timeout(20000);
      expect(wsData["changePercent"]).to.not.be.null;

      done();
      process.exit(0);
    });
  });
});
