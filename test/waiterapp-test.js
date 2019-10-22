assert = require("assert");
const LoginsFactory = require("../services/logins-factory");
const WaitersFactory = require("../services/waiters-factory")
const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://warwick:pg123@localhost:5432/javascriptcafe';
var bcrypt = require('bcryptjs');

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const pool = new Pool({
    connectionString,
    ssl: useSSL
});


describe('createAccount function', function () {
    beforeEach(async function () {
        await pool.query(`delete from info`);
        await pool.query(`delete from waiters`);
        await pool.query(`delete from accounts`);
    });
    it('should populate the accounts table with a new user account', async function () {
        let loginsFactory = LoginsFactory(pool)
        let accountData = {username: "Warwick", password: "Qwerty", email: "warwick.nortier@gmail.com"}
        await loginsFactory.createAccount(accountData)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        let idForFirstAccount = accountExtraction[0].id
        let waitersExtraction = await loginsFactory.waitersTestAssistant()
        assert.equal(1, accountExtraction.length);
        assert.equal("Warwick", accountExtraction[0].username)
        assert.equal("warwick.nortier@gmail.com", accountExtraction[0].email)
        assert.equal(idForFirstAccount, accountExtraction[0].id)
        assert.equal(1, waitersExtraction.length)
        assert.equal("Warwick", waitersExtraction[0].waiter_username)
        assert.equal(idForFirstAccount, waitersExtraction[0].waiters_id)
    });
});

describe('login function', function () {
    beforeEach(async function () {
        await pool.query(`delete from info`);
        await pool.query(`delete from waiters`);
        await pool.query(`delete from accounts`);
    });
    it('should return all account data on the user logging in for rendering purposes', async function () {
        let loginsFactory = LoginsFactory(pool)
        let accountData = {username: "Warwick", password: "Qwerty", email: "warwick.nortier@gmail.com"}
        await loginsFactory.createAccount(accountData)
        let loginData = await loginsFactory.login("warwick.nortier@gmail.com")
        let idForFirstAccount = accountExtraction[0].id
        assert.equal("Warwick", loginData[0].username)
        assert.equal("warwick.nortier@gmail.com", loginData[0].email)
        assert.equal(idForFirstAccount, loginData[0].id)
    });
});

// describe('login function', function () {
//     beforeEach(async function () {
//         await pool.query(`delete from info`);
//         await pool.query(`delete from waiters`);
//         await pool.query(`delete from accounts`);
//     });
//     it('should return all account data on the user logging in for rendering purposes', async function () {
//         let loginsFactory = LoginsFactory(pool)
//         let accountData = {username: "Warwick", password: "Qwerty", email: "warwick.nortier@gmail.com"}
//         await loginsFactory.createAccount(accountData)
//         let loginData = await loginsFactory.login("warwick.nortier@gmail.com")
//         let idForFirstAccount = accountExtraction[0].id
//         assert.equal("Warwick", loginData[0].username)
//         assert.equal("warwick.nortier@gmail.com", loginData[0].email)
//         assert.equal(idForFirstAccount, loginData[0].id)
//     });
// });

after(function () {
    pool.end();
})