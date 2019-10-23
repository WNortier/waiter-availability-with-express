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


// describe('createAccount function', function () {
//     beforeEach(async function () {
//         await pool.query(`delete from info`);
//         await pool.query(`delete from waiters`);
//         await pool.query(`delete from accounts`);
//     });
//     it('should populate the accounts table with a new user account with a unique id and email address', async function () {
//         let loginsFactory = LoginsFactory(pool)
//         let accountData = {
//             username: "Warwick",
//             password: "Qwerty",
//             email: "warwick.nortier@gmail.com"
//         }
//         await loginsFactory.createAccount(accountData)
//         let accountExtraction = await loginsFactory.accountsTestAssistant()
//         let idForFirstAccount = accountExtraction[0].id
//         //let waitersExtraction = await loginsFactory.waitersTestAssistant()
//         assert.equal(1, accountExtraction.length);
//         assert.equal("Warwick", accountExtraction[0].username)
//         assert.equal("warwick.nortier@gmail.com", accountExtraction[0].email)
//         assert.equal(idForFirstAccount, accountExtraction[0].id)
//     });
//     it('should populate the accounts table with additional users with their unique id(s) and email address(s)', async function () {
//         let loginsFactory = LoginsFactory(pool)
//         let accountDataOne = {
//             username: "Warwick",
//             password: "Qwerty",
//             email: "warwick.nortier@gmail.com"
//         }
//         let accountDataTwo = {
//             username: "Frank",
//             password: "Qwerty",
//             email: "frank@gmail.com"
//         }
//         let accountDataThree = {
//             username: "Josie",
//             password: "Qwerty",
//             email: "josie@gmail.com"
//         }
//         //Creating first account, second and third account
//         await loginsFactory.createAccount(accountDataOne).then(await loginsFactory.createAccount(accountDataTwo)).then(await loginsFactory.createAccount(accountDataThree))
//         let accountExtraction = await loginsFactory.accountsTestAssistant()
//         let idForFirstAccount = accountExtraction[0].id
//         //Length should be 3 due to three accounts
//         assert.equal(3, accountExtraction.length);
//         //Checking first account
//         assert.equal("Warwick", accountExtraction[0].username)
//         assert.equal("warwick.nortier@gmail.com", accountExtraction[0].email)
//         assert.equal(idForFirstAccount, accountExtraction[0].id)
//         let idForSecondAccount = accountExtraction[1].id
//         //Checking second account
//         assert.equal("Frank", accountExtraction[1].username)
//         assert.equal("frank@gmail.com", accountExtraction[1].email)
//         assert.equal(idForSecondAccount, accountExtraction[1].id)
//         //Checking third account
//         let idForThirdAccount = accountExtraction[2].id
//         assert.equal("Josie", accountExtraction[2].username)
//         assert.equal("josie@gmail.com", accountExtraction[2].email)
//         assert.equal(idForThirdAccount, accountExtraction[2].id)
//     });
// });

// describe('login function', function () {
//     beforeEach(async function () {
//         await pool.query(`delete from info`);
//         await pool.query(`delete from waiters`);
//         await pool.query(`delete from accounts`);
//     });
//     it('should return all account data on the user logging in for rendering purposes', async function () {
//         let loginsFactory = LoginsFactory(pool)
//         let accountData = {
//             username: "Warwick",
//             password: "Qwerty",
//             email: "warwick.nortier@gmail.com"
//         }
//         await loginsFactory.createAccount(accountData)
//         let loginData = await loginsFactory.login("warwick.nortier@gmail.com")
//         let accountExtraction = await loginsFactory.accountsTestAssistant()
//         let idForFirstAccount = accountExtraction[0].id
//         assert.equal("Warwick", loginData[0].username)
//         assert.equal("warwick.nortier@gmail.com", loginData[0].email)
//         assert.equal(idForFirstAccount, loginData[0].id)
//     });
// });

// describe('shiftsPopulator function', function () {
    // beforeEach(async function () {
    //     await pool.query(`delete from info`);
    //     await pool.query(`delete from waiters`);
    //     await pool.query(`delete from accounts`);
    // });
    // it('should populate the waiters table based on workdays selected', async function () {
    //     let loginsFactory = LoginsFactory(pool)
    //     let waitersFactory = WaitersFactory(pool)
    //     let accountData = {
    //         username: "Warwick",
    //         password: "Qwerty",
    //         email: "warwick.nortier@gmail.com"
    //     }
    //     await loginsFactory.createAccount(accountData)
    //     let accountExtraction = await loginsFactory.accountsTestAssistant()
    //     let idForFirstAccount = accountExtraction[0].id
    //     await waitersFactory.shiftsPopulator("Monday", idForFirstAccount)
    //         .then(await waitersFactory.shiftsPopulator("Tuesday", idForFirstAccount))
    //         .then(await waitersFactory.shiftsPopulator("Wednesday", idForFirstAccount))
    //         .then(await waitersFactory.shiftsPopulator("Thursday", idForFirstAccount))
    //         .then(await waitersFactory.shiftsPopulator("Friday", idForFirstAccount))
    //         .then(await waitersFactory.shiftsPopulator("Saturday", idForFirstAccount))
    //         .then(await waitersFactory.shiftsPopulator("Sunday", idForFirstAccount))
    // });
//     beforeEach(async function () {
//         await pool.query(`delete from info`);
//         await pool.query(`delete from waiters`);
//         await pool.query(`delete from accounts`);
//     });

//     it('should populate the waiters table based on workdays selected and prevent duplicate days', async function () {
//         let loginsFactory = LoginsFactory(pool)
//         let waitersFactory = WaitersFactory(pool)
//         let accountData = {
//             username: "Warwick",
//             password: "Qwerty",
//             email: "warwick.nortier@gmail.com"
//         }
//         await loginsFactory.createAccount(accountData)
//         let accountExtraction = await loginsFactory.accountsTestAssistant()
//         let idForFirstAccount = accountExtraction[0].id
//         await waitersFactory.shiftsPopulator("Monday", idForFirstAccount)
//         await waitersFactory.shiftsPopulator("Monday", idForFirstAccount)
//         let waitersExtraction = await loginsFactory.waitersTestAssistant()
//         let error = await waitersFactory.errorTestAssistant()
//         assert.equal(1, waitersExtraction.length)
//         assert.equal("That weekday has already been entered!", error)
//     });
// });

describe('infoPopulator function', function () {
    beforeEach(async function () {
        await pool.query(`delete from info`);
        await pool.query(`delete from waiters`);
        await pool.query(`delete from accounts`);
    });

    it('should populate the info table based on the information contained in the waiters table', async function () {
        let loginsFactory = LoginsFactory(pool)
        let waitersFactory = WaitersFactory(pool)
        let accountData = {
            username: "Warwick",
            password: "Qwerty",
            email: "warwick.nortier@gmail.com"
        }
        let accountDataTwo = {
            username: "Frank",
            password: "Qwerty",
            email: "frank@gmail.com"
        }
        await loginsFactory.createAccount(accountData)
        await loginsFactory.createAccount(accountDataTwo)
        //await loginsFactory.createAccount(accountDataThree)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        let idForFirstAccount = accountExtraction[0].id
        let idForSecondAccount = accountExtraction[1].id
        await waitersFactory.shiftsPopulator("Monday", idForFirstAccount)
        await waitersFactory.shiftsPopulator("Monday", idForSecondAccount)
        await waitersFactory.shiftsPopulator("Tuesday", idForFirstAccount)
        let waitersExtraction = await loginsFactory.waitersTestAssistant()
        //let error = await waitersFactory.errorTestAssistant()
        assert.equal(3, waitersExtraction.length)
        let infoExtraction = await waitersFactory.dayCounter()
    });
});

after(function () {
    pool.end();
})