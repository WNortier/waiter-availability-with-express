assert = require("assert");
const LoginsFactory = require("../services/logins-factory");



describe("Greeting function", function () {
    it("should perform a greeting", function () {
        const loginsFactory = LoginsFactory();

        mockTest.greet("Warwick")
        assert.equal("Hello Warwick", loginsFactory.getGreet())
    });
});