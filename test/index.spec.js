var WebSocket = require("ws"),
  protobuf = require("../src/__finStreamer-proto"),
  expect = require("chai").expect;

describe("Suite of Unit Tests", function () {
  var ws;
  var wsData;

  beforeEach(function (done) {
    this.timeout(10000);
    //Setup
    ws = new WebSocket("wss://streamer.finance.yahoo.com", null, {
      origin: "https://ca.finance.yahoo.com",
    });
    //Open
    ws.on("open", function open() {
      console.log("worked...");
      ws.send('{"subscribe": ["TSLA"]}');
    });
    //Receive
    ws.on("message", function incoming(data) {
      var buffer = base64ToArray(data);
      var PricingData = protobuf.quotefeeder.PricingData;
      wsData = PricingData.decode(buffer);
      wsData = PricingData.toObject(wsData, {
        enums: String,
      });
      done();
    });
    //Close
    ws.on("close", function () {
      console.log("Socket disconnected.");
    });
  });

  afterEach(function (done) {
    this.timeout(10000);
    //Cleanup
    console.log("Socket closing...");
    ws.send("close");
    done();
  });

  describe("BlackBox", function () {
    it("Checking the type, length, and properties of the data object.", function (done) {
      this.timeout(10000);
      //Checking type
      expect(wsData).to.be.an("object");

      //Checking for non-empty
      expect(Object.keys(wsData).length).to.be.greaterThan(1);

      //Checking properties
      expect(wsData.hasOwnProperty("id"));
      expect(wsData.hasOwnProperty("price"));
      expect(wsData.hasOwnProperty("time"));
      expect(wsData.hasOwnProperty("exchange"));
      expect(wsData.hasOwnProperty("quoteType"));
      expect(wsData.hasOwnProperty("marketHours"));
      expect(wsData.hasOwnProperty("changePercent"));

      done();
    });

    it("Checking the property values of the returned data object.", function (done) {
      this.timeout(10000);

      //Check property values
      expect(wsData["id"]).to.be.equal("TSLA");
      expect(wsData["price"]).to.be.greaterThan(1);
      expect(wsData["time"]).to.not.be.null;
      expect(wsData["exchange"]).to.not.be.null;
      expect(wsData["quoteType"]).to.not.be.null;
      expect(wsData["marketHours"]).to.not.be.null;
      expect(wsData["changePercent"]).to.not.be.null;

      done();
    });
  });
});

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
