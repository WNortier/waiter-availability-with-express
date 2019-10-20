assert = require("assert");
const LoginsFactory = require("../services/logins-factory");
const WaitersFactory = require("../services/waiters-factory")

describe("password hasher", function () {
    it("should perform a greeting", function () {
        const loginsFactory = LoginsFactory();
        assert.deepEqual({'Hello World!'}, loginsFactory.helloWorld())
    });
});