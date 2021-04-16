var WebSocket = require("ws"),
  protobuf = require("../src/__finStreamer-proto"),
  expect = require("chai").expect;

describe("UT Suite checking Yahoo Socket Connection & Response", function () {
  var ws;
  var wsData;

  this.beforeAll(function (done) {
    this.timeout(20000);
    //Setup
    ws = new WebSocket("wss://streamer.finance.yahoo.com", null, {
      origin: "https://ca.finance.yahoo.com",
    });
    //Open
    ws.on("open", function open() {
      console.log("Socket opened.");
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
      ws.send("close");
      done();
    });
    //Close
    ws.on("close", function () {
      console.log("Socket disconnected.");
    });
  });

  afterEach(function (done) {
    this.timeout(20000);
    done();
  });

  describe("Websocket Connection and Response Tests", function () {
    it("Checking the data object type", function (done) {
      this.timeout(20000);
      expect(wsData).to.be.an("object");

      done();
    });
    it("Checking the data object length", function (done) {
      this.timeout(20000);
      expect(Object.keys(wsData).length).to.be.greaterThan(1);

      done();
    });
    it("Checking the data object property keys", function (done) {
      this.timeout(20000);
      expect(wsData.hasOwnProperty("id"));
      expect(wsData.hasOwnProperty("price"));
      expect(wsData.hasOwnProperty("time"));
      expect(wsData.hasOwnProperty("exchange"));
      expect(wsData.hasOwnProperty("quoteType"));
      expect(wsData.hasOwnProperty("marketHours"));
      expect(wsData.hasOwnProperty("changePercent"));

      done();
    });

    it("Checking the data object property values", function (done) {
      this.timeout(20000);
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
