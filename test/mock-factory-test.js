assert = require("assert");
const MockFactory = require("../factoryfunction");



describe("Greeting function", function () {
    it("should perform a greeting", function () {
        const mockTest = MockFactory();

        mockTest.greet("Warwick")
        assert.equal("Hello Warwick", mockTest.getGreet())
    });
});