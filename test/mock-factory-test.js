assert = require("assert");
const LoginsFactory = require("../services/logins-factory");
const WaitersFactory = require("../services/waiters-factory")
const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://warwick:pg123@localhost:5432/javascriptcafe';

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const pool = new Pool({
    connectionString,
    ssl: useSSL
});


describe('performGreeting function', function () {
    beforeEach(async function () {
        await pool.query(`delete from info`);
        await pool.query(`delete from waiters`);
        await pool.query(`delete from accounts`);
    });
    it('should populate the accounts table with a new user account', async function () {
        let loginsFactory = LoginsFactory(pool);
        await expressRegistrations.formatScrutinizer_And_tablePopulator("cz55441");
        let errorMessage = await expressRegistrations.errorTestAssistant()
        assert.equal("You have entered an invalid town!", errorMessage);
    });
});
after(function () {
    pool.end();
})