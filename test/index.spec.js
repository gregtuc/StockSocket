var expect = require("chai").expect;

describe("Test ticker cache functionality (valid inputs)", function () {
	var stockSocket = require("../socket");
	beforeEach(function () {
		if (stockSocket.list().length > 0) {
			stockSocket.clear();
		}
	});
	this.afterAll(function () {
		stockSocket = "";
	});

	it("should be able to add a single ticker", function () {
		stockSocket.addTicker("AAPL");
		expect(stockSocket.list()).to.deep.equal(["AAPL"]);
	});
	it("should be able to add multiple tickers", function () {
		stockSocket.addTickers(["AAPL", "MSFT"]);
		expect(stockSocket.list()).to.deep.equal(["AAPL", "MSFT"]);
	});
	it("should be able to remove a single ticker", function () {
		stockSocket.addTickers(["AAPL", "MSFT"]);
		stockSocket.removeTicker("AAPL");
		expect(stockSocket.list()).to.deep.equal(["MSFT"]);
	});
	it("should be able to remove multiple tickers", function () {
		stockSocket.addTickers(["AAPL", "MSFT"]);
		stockSocket.removeTickers(["AAPL", "MSFT"]);
		expect(stockSocket.list()).to.deep.equal([]);
	});
	it("should be able to clear all tickers", function () {
		stockSocket.addTickers(["AAPL", "MSFT"]);
		stockSocket.clear();
		expect(stockSocket.list()).to.deep.equal([]);
	});
});

describe("Test ticker cache functionality (invalid inputs)", function () {
	var stockSocket;
	beforeEach(function () {
		stockSocket = require("../socket");
	});
	afterEach(function () {
		stockSocket.clear();
	});
	this.afterAll(function () {
		stockSocket = "";
	});

	it("shouldn't be able to add a non-string ticker", function () {
		stockSocket.addTicker(0);
		expect(stockSocket.list()).to.deep.equal([]);
	});
	it("shouldn't be able to add an empty ticker", function () {
		stockSocket.addTicker("");
		expect(stockSocket.list()).to.deep.equal([]);
	});
	it("shouldn't be able to add an array using addTicker", function () {
		stockSocket.addTicker(["AAPL", "MSFT"]);
		expect(stockSocket.list()).to.deep.equal([]);
	});
	it("shouldn't be able to add multiple non-string tickers", function () {
		stockSocket.addTickers([0, 1]);
		expect(stockSocket.list()).to.deep.equal([]);
	});
	it("shouldn't be able to add multiple empty tickers", function () {
		stockSocket.addTickers(["", ""]);
		expect(stockSocket.list()).to.deep.equal([]);
	});
	it("shouldn't be able to add a non-array using addTickers", function () {
		stockSocket.addTickers("TSLA");
		expect(stockSocket.list()).to.deep.equal([]);
	});
	it("shouldn't be able to remove a non-existent ticker", function () {
		stockSocket.addTicker(["MSFT"]);
		stockSocket.removeTicker("AAPL");
		expect(stockSocket.list()).to.deep.equal([]);
	});
	it("shouldn't be able to remove multiple non-existent tickers", function () {
		stockSocket.addTicker(["TSLA", "NIO"]);
		stockSocket.removeTickers(["AAPL", "MSFT"]);
		expect(stockSocket.list()).to.deep.equal([]);
	});
});
