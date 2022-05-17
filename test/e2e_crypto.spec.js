var expect = require("chai").expect;

describe("End-End Test (Cryptocurrency)", function () {
	var stockSocket;
	var ticker = "BTC-USD";
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

	this.afterAll(function () {
		stockSocket = "";
	});

	it("Data Object is of type object", function () {
		expect(wsData).to.be.an("object");
	});

	it("Data Object is greater than length 1", function () {
		expect(Object.keys(wsData).length).to.be.greaterThan(1);
	});

	//ID property
	it("id property: exists", function () {
		expect(wsData.hasOwnProperty("id"));
	});
	it("id property: is type string", function () {
		expect(typeof wsData.id === "string");
	});
	it("id property: is length > 1", function () {
		expect(wsData.id.length > 1);
	});
	it(`id property: is equal to ${ticker}`, function () {
		expect(typeof wsData.id === ticker);
	});

	//Price property
	it("price property: exists", function () {
		expect(wsData.hasOwnProperty("price"));
	});
	it("price property: is type number", function () {
		expect(typeof wsData.price === "number");
	});
	it("price property: is non negative", function () {
		expect(wsData.price >= 0);
	});

	//Time property
	it("time property: exists", function () {
		expect(wsData.hasOwnProperty("time"));
	});
	it("time property: is type string", function () {
		expect(typeof wsData.time === "string");
	});
	it("time property: is not null", function () {
		expect(wsData.time !== null);
	});

	//Currency property
	it("currency property: exists", function () {
		expect(wsData.hasOwnProperty("currency"));
	});
	it("currency property: is type string", function () {
		expect(typeof wsData.currency === "string");
	});
	it("currency property: is not null", function () {
		expect(wsData.currency !== null);
	});

	//Exchange Property
	it("exchange property: exists", function () {
		expect(wsData.hasOwnProperty("exchange"));
	});
	it("exchange property: is type string", function () {
		expect(typeof wsData.exchange === "string");
	});
	it("exchange property: is equal to USD", function () {
		expect(wsData.exchange === "USD");
	});

	//QuoteType Property
	it("quoteType property: exists", function () {
		expect(wsData.hasOwnProperty("quoteType"));
	});
	it("quoteType property: is type string", function () {
		expect(typeof wsData.quoteType === "string");
	});
	it(`quoteType property: is equal to CRYPTOCURRENCY`, function () {
		expect(wsData.quoteType === "CRYPTOCURRENCY");
	});

	//MarketHours Property
	it("marketHours property: exists", function () {
		expect(wsData.hasOwnProperty("marketHours"));
	});
	it("marketHours property: is type string", function () {
		expect(typeof wsData.marketHours === "string");
	});
	it("marketHours property: is equal to REGULAR_MARKET", function () {
		expect(wsData.marketHours === "REGULAR_MARKET");
	});

	//ChangePercent Property
	it("changePercent property: exists", function () {
		expect(wsData.hasOwnProperty("changePercent"));
	});
	it("changePercent property: is type number", function () {
		expect(typeof wsData.changePercent === "number");
	});
	it("changePercent property: is not null", function () {
		expect(wsData.changePercent !== null);
	});

	//DayVolume Property
	it("dayVolume property: exists", function () {
		expect(wsData.hasOwnProperty("dayVolume"));
	});
	it("dayVolume property: is type string", function () {
		expect(typeof wsData.dayVolume === "string");
	});
	it("dayVolume property: is not null", function () {
		expect(wsData.dayVolume !== null);
	});

	//DayHigh Property
	it("dayHigh property: exists", function () {
		expect(wsData.hasOwnProperty("dayHigh"));
	});
	it("dayHigh property: is type number", function () {
		expect(typeof wsData.dayHigh === "number");
	});
	it("dayHigh property: is not negative", function () {
		expect(wsData.dayHigh >= 0);
	});

	//DayLow Property
	it("dayLow property: exists", function () {
		expect(wsData.hasOwnProperty("dayLow"));
	});

	it("dayLow property: is type number", function () {
		expect(typeof wsData.dayLow === "number");
	});
	it("dayLow property: is not negative", function () {
		expect(wsData.dayLow >= 0);
	});

	//Change Property
	it("change property: exists", function () {
		expect(wsData.hasOwnProperty("change"));
	});
	it("change property: is type number", function () {
		expect(typeof wsData.change === "number");
	});
	it("change property: is not null", function () {
		expect(wsData.change !== null);
	});

	//ShortName Property
	it("shortName property: exists", function () {
		expect(wsData.hasOwnProperty("shortName"));
	});
	it("shortName property: is type string", function () {
		expect(typeof wsData.shortName === "string");
	});
	it("shortName property: is equal to Ethereum USD", function () {
		expect(wsData.shortName === "Ethereum USD");
	});

	//LastSize Property
	it("lastSize property: exists", function () {
		expect(wsData.hasOwnProperty("lastSize"));
	});
	it("lastSize property: is type number", function () {
		expect(typeof wsData.lastSize === "number");
	});
	it("lastSize property: is not null", function () {
		expect(wsData.lastSize !== null);
	});

	//PriceHint Property
	it("priceHint property: exists", function () {
		expect(wsData.hasOwnProperty("priceHint"));
	});
	it("priceHint property: is type string", function () {
		expect(typeof wsData.priceHint === "string");
	});
	it("priceHint property: is not null", function () {
		expect(wsData.priceHint !== null);
	});

	//Vol_24hr Property
	it("vol_24hr property: exists", function () {
		expect(wsData.hasOwnProperty("vol_24hr"));
	});
	it("vol_24hr property: is type string", function () {
		expect(typeof wsData.vol_24hr === "string");
	});
	it("vol_24hr property: is not null", function () {
		expect(wsData.vol_24hr !== null);
	});

	//VolAll_Currencies Property
	it("volAll_Currencies property: exists", function () {
		expect(wsData.hasOwnProperty("volAll_Currencies"));
	});
	it("volAll_Currencies property: is type string", function () {
		expect(typeof wsData.volAll_Currencies === "string");
	});
	it("volAll_Currencies property: is not null", function () {
		expect(wsData.volAll_Currencies !== null);
	});

	//FromCurrency Property
	it("fromCurrency property: exists", function () {
		expect(wsData.hasOwnProperty("fromCurrency"));
	});
	it("fromCurrency property: is type string", function () {
		expect(typeof wsData.fromCurrency === "string");
	});
	it("fromCurrency property: is equal to ETH", function () {
		expect(wsData.fromCurrency === "ETH");
	});

	//LastMarket Property
	it("lastMarket property: exists", function () {
		expect(wsData.hasOwnProperty("lastMarket"));
	});
	it("lastMarket property: is type string", function () {
		expect(typeof wsData.lastMarket === "string");
	});
	it("lastMarket property: is not null", function () {
		expect(wsData.lastMarket !== null);
	});

	//CirculatingSupply Property
	it("circulatingSupply property: exists", function () {
		expect(wsData.hasOwnProperty("circulatingSupply"));
	});
	it("circulatingSupply property: is type number", function () {
		expect(typeof wsData.circulatingSupply === "number");
	});
	it("circulatingSupply property: is not null", function () {
		expect(wsData.circulatingSupply !== null);
	});
	it("circulatingSupply property: is not negative", function () {
		expect(wsData.circulatingSupply >= 0);
	});

	//MarketCap Property
	it("marketCap property: exists", function () {
		expect(wsData.hasOwnProperty("marketCap"));
	});
	it("marketCap property: is type number", function () {
		expect(typeof wsData.marketCap === "number");
	});
	it("marketCap property: is not null", function () {
		expect(wsData.marketCap !== null);
	});
	it("marketCap property: is not negative", function () {
		expect(wsData.marketCap >= 0);
	});
});
