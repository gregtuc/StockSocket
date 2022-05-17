var expect = require("chai").expect;

describe("End-End Test (Pre-Market)", function () {
	//If not in Pre-Market, skip the test
	var currentTimeString = new Date().toLocaleString("en-US", {
		timeZone: "America/New_York",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		hour12: false,
	});
	var day = new Date().getDay();

	if (
		currentTimeString >= "04:00:00" &&
		currentTimeString <= "09:29:00" &&
		day != 6 &&
		day != 0
	) {
		var stockSocket;
		var ticker = "TSLA";
		var wsData = "";

		this.beforeAll(function (done) {
			//This test is flaky because on slow trading days data can take > 60s
			this.timeout(120000);

			stockSocket = require("../socket");
			stockSocket.clear();
			stockSocket.addTicker(ticker, callback);

			function callback(data) {
				wsData = data;
				stockSocket.stop();
				done();
			}
		});

		afterEach(function (done) {
			done();
		});

		//ID property
		it("id property: exists", function (done) {
			expect(wsData.hasOwnProperty("id"));
			done();
		});
		it("id property: is type string", function (done) {
			expect(typeof wsData.id === "string");
			done();
		});
		it("id property: is length > 1", function (done) {
			expect(wsData.id.length > 1);
			done();
		});
		it(`id property: is equal to ${ticker}`, function (done) {
			expect(typeof wsData.id === ticker);
			done();
		});

		//Price property
		it("price property: exists", function (done) {
			expect(wsData.hasOwnProperty("price"));
			done();
		});
		it("price property: is type number", function (done) {
			expect(typeof wsData.price === "number");
			done();
		});
		it("price property: is non negative", function (done) {
			expect(wsData.price >= 0);
			done();
		});

		//Time property
		it("time property: exists", function (done) {
			expect(wsData.hasOwnProperty("time"));
			done();
		});
		it("time property: is type string", function (done) {
			expect(typeof wsData.time === "string");
			done();
		});
		it("time property: is not null", function (done) {
			expect(wsData.time !== null);
			done();
		});

		//Exchange Property
		it("exchange property: exists", function (done) {
			expect(wsData.hasOwnProperty("exchange"));
			done();
		});
		it("exchange property: is type string", function (done) {
			expect(typeof wsData.exchange === "string");
			done();
		});
		it("exchange property: is equal to NMS", function (done) {
			expect(wsData.exchange === "NMS");
			done();
		});

		//QuoteType Property
		it("quoteType property: exists", function (done) {
			expect(wsData.hasOwnProperty("quoteType"));
			done();
		});
		it("quoteType property: is type string", function (done) {
			expect(typeof wsData.quoteType === "string");
			done();
		});
		it(`quoteType property: is equal to EQUITY`, function (done) {
			expect(wsData.quoteType === "EQUITY");
			done();
		});

		//MarketHours Property
		it("marketHours property: exists", function (done) {
			expect(wsData.hasOwnProperty("marketHours"));
			done();
		});
		it("marketHours property: is type string", function (done) {
			expect(typeof wsData.marketHours === "string");
			done();
		});
		it("marketHours property: is equal to PRE_MARKET", function (done) {
			expect(wsData.marketHours === "PRE_MARKET");
			done();
		});

		//ChangePercent Property
		it("changePercent property: exists", function (done) {
			expect(wsData.hasOwnProperty("changePercent"));
			done();
		});
		it("changePercent property: is type number", function (done) {
			expect(typeof wsData.changePercent === "number");
			done();
		});
		it("changePercent property: is not null", function (done) {
			expect(wsData.changePercent !== null);
			done();
		});

		//Change Property
		it("change property: exists", function (done) {
			expect(wsData.hasOwnProperty("change"));
			done();
		});
		it("change property: is type number", function (done) {
			expect(typeof wsData.change === "number");
			done();
		});
		it("change property: is not null", function (done) {
			expect(wsData.change !== null);
			done();
		});

		//PriceHint Property
		it("priceHint property: exists", function (done) {
			expect(wsData.hasOwnProperty("priceHint"));
			done();
		});
		it("priceHint property: is type string", function (done) {
			expect(typeof wsData.priceHint === "string");
			done();
		});
		it("priceHint property: is not null", function (done) {
			expect(wsData.priceHint !== null);
			done();
		});
	}
});
