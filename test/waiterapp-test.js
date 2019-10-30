assert = require("assert");
const LoginsFactory = require("../services/logins-factory");
const WaitersFactory = require("../services/waiters-factory")
const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://warwick:pg123@localhost:5432/javascriptcafe_test';
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
    it('should populate the accounts table with a new user account with a unique id and email address', async function () {
        let loginsFactory = LoginsFactory(pool)
        let accountData = {
            username: "Warwick",
            password: "Qwerty",
            email: "warwick.nortier@gmail.com"
        }
        await loginsFactory.createAccount(accountData)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        let idForFirstAccount = accountExtraction[0].id
        //let waitersExtraction = await loginsFactory.waitersTestAssistant()
        assert.equal(1, accountExtraction.length);
        assert.equal("Warwick", accountExtraction[0].username)
        assert.equal("warwick.nortier@gmail.com", accountExtraction[0].email)
        assert.equal(idForFirstAccount, accountExtraction[0].id)
    });
    it('should populate the accounts table with additional users with their unique id(s) and email address(s)', async function () {
        let loginsFactory = LoginsFactory(pool)
        let accountDataOne = {
            username: "Warwick",
            password: "Qwerty",
            email: "warwick.nortier@gmail.com"
        }
        let accountDataTwo = {
            username: "Frank",
            password: "Qwerty",
            email: "frank@gmail.com"
        }
        let accountDataThree = {
            username: "Josie",
            password: "Qwerty",
            email: "josie@gmail.com"
        }
        //Creating first account, second and third account
        await loginsFactory.createAccount(accountDataOne).then(await loginsFactory.createAccount(accountDataTwo)).then(await loginsFactory.createAccount(accountDataThree))
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        let idForFirstAccount = accountExtraction[0].id
        //Length should be 3 due to three accounts
        assert.equal(3, accountExtraction.length);
        //Checking first account
        assert.equal("Warwick", accountExtraction[0].username)
        assert.equal("warwick.nortier@gmail.com", accountExtraction[0].email)
        assert.equal(idForFirstAccount, accountExtraction[0].id)
        let idForSecondAccount = accountExtraction[1].id
        //Checking second account
        assert.equal("Frank", accountExtraction[1].username)
        assert.equal("frank@gmail.com", accountExtraction[1].email)
        assert.equal(idForSecondAccount, accountExtraction[1].id)
        //Checking third account
        let idForThirdAccount = accountExtraction[2].id
        assert.equal("Josie", accountExtraction[2].username)
        assert.equal("josie@gmail.com", accountExtraction[2].email)
        assert.equal(idForThirdAccount, accountExtraction[2].id)
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
        let accountData = {
            username: "Warwick",
            password: "Qwerty",
            email: "warwick.nortier@gmail.com"
        }
        await loginsFactory.createAccount(accountData)
        let loginData = await loginsFactory.login("warwick.nortier@gmail.com")
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        let idForFirstAccount = accountExtraction[0].id
        assert.equal("Warwick", loginData[0].username)
        assert.equal("warwick.nortier@gmail.com", loginData[0].email)
        assert.equal(idForFirstAccount, loginData[0].id)
    });
});

describe('shiftsPopulator function', function () {
    beforeEach(async function () {
        await pool.query(`delete from info`);
        await pool.query(`delete from waiters`);
        await pool.query(`delete from accounts`);
    });
    it('should populate the waiters table based on workdays selected', async function () {
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
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        let idForFirstAccount = accountExtraction[0].id
        let idForSecondAccount = accountExtraction[1].id
        await waitersFactory.shiftsPopulator("Monday", idForFirstAccount)
            .then(await waitersFactory.shiftsPopulator("Tuesday", idForFirstAccount))
            .then(await waitersFactory.shiftsPopulator("Sunday", idForSecondAccount))
            .then(await waitersFactory.shiftsPopulator("Wednesday", idForFirstAccount))
            .then(await waitersFactory.shiftsPopulator("Thursday", idForFirstAccount))
            .then(await waitersFactory.shiftsPopulator("Friday", idForFirstAccount))
            .then(await waitersFactory.shiftsPopulator("Saturday", idForFirstAccount))
            .then(await waitersFactory.shiftsPopulator("Sunday", idForFirstAccount))
        let waitersExtraction = await loginsFactory.waitersTestAssistant()
        assert.equal(8, waitersExtraction.length)
        assert.equal("Frank", waitersExtraction[2].waiter_username)
    });

    beforeEach(async function () {
        await pool.query(`delete from info`);
        await pool.query(`delete from waiters`);
        await pool.query(`delete from accounts`);
    });

    it('should populate the waiters table based on workdays selected and prevent duplicate days', async function () {
        let loginsFactory = LoginsFactory(pool)
        let waitersFactory = WaitersFactory(pool)
        let accountData = {
            username: "Warwick",
            password: "Qwerty",
            email: "warwick.nortier@gmail.com"
        }
        await loginsFactory.createAccount(accountData)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        let idForFirstAccount = accountExtraction[0].id
        await waitersFactory.shiftsPopulator("Monday", idForFirstAccount)
        await waitersFactory.shiftsPopulator("Monday", idForFirstAccount)
        let waitersExtraction = await loginsFactory.waitersTestAssistant()
        let error = await waitersFactory.errorTestAssistant()
        assert.equal(1, waitersExtraction.length)
        assert.equal("That weekday has already been entered!", error)
    });
});

describe('removeShiftsForUser function', function () {
    beforeEach(async function () {
        await pool.query(`delete from info`);
        await pool.query(`delete from waiters`);
        await pool.query(`delete from accounts`);
    });
    it('should remove all submissions from waiters table for said waiter ', async function () {
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
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        let idForFirstAccount = accountExtraction[0].id
        let idForSecondAccount = accountExtraction[1].id
        await waitersFactory.shiftsPopulator("Monday", idForFirstAccount)
            .then(await waitersFactory.shiftsPopulator("Tuesday", idForFirstAccount))
            .then(await waitersFactory.shiftsPopulator("Sunday", idForSecondAccount))
            .then(await waitersFactory.shiftsPopulator("Wednesday", idForFirstAccount))
            .then(await waitersFactory.shiftsPopulator("Thursday", idForFirstAccount))
            .then(await waitersFactory.shiftsPopulator("Friday", idForFirstAccount))
            .then(await waitersFactory.shiftsPopulator("Saturday", idForFirstAccount))
            .then(await waitersFactory.shiftsPopulator("Sunday", idForFirstAccount))
        let waitersExtraction = await loginsFactory.waitersTestAssistant()
        assert.equal(8, waitersExtraction.length)
        assert.equal("Frank", waitersExtraction[2].waiter_username)
        await waitersFactory.removeShiftsForUser(idForFirstAccount)
        let waitersExtractionAfterUserShiftsRemoval = await loginsFactory.waitersTestAssistant()
        assert.equal(1, waitersExtractionAfterUserShiftsRemoval.length)
    });
});

describe('workingDaysDisplayer function', function () {
    beforeEach(async function () {
        await pool.query(`delete from info`);
        await pool.query(`delete from waiters`);
        await pool.query(`delete from accounts`);
    });
    it('should display the workdays information to the waiter after choosing which day to work by returning the waiter table rows', async function () {
        let loginsFactory = LoginsFactory(pool)
        let waitersFactory = WaitersFactory(pool)
        let accountData = {
            username: "Warwick",
            password: "Qwerty",
            email: "warwick.nortier@gmail.com"
        }
        await loginsFactory.createAccount(accountData)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        let idForFirstAccount = accountExtraction[0].id
        await waitersFactory.shiftsPopulator("Monday", idForFirstAccount)
            .then(await waitersFactory.shiftsPopulator("Tuesday", idForFirstAccount))
            .then(await waitersFactory.shiftsPopulator("Wednesday", idForFirstAccount))
            .then(await waitersFactory.shiftsPopulator("Thursday", idForFirstAccount))
        let waitersExtraction = await loginsFactory.waitersTestAssistant()
        assert.equal(4, waitersExtraction.length)
    });
});

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
        await waitersFactory.dayCounter()
        let infoExtraction = await waitersFactory.infoTestAssistant()
        assert.equal("Monday", infoExtraction[0].weekday)
        assert.equal(2, infoExtraction[0].waiters_for_day)

        assert.equal("Tuesday", infoExtraction[1].weekday)
        assert.equal(1, infoExtraction[1].waiters_for_day)

        assert.equal("Wednesday", infoExtraction[2].weekday)
        assert.equal(0, infoExtraction[2].waiters_for_day)

        assert.equal("Thursday", infoExtraction[3].weekday)
        assert.equal(0, infoExtraction[3].waiters_for_day)

        assert.equal("Friday", infoExtraction[4].weekday)
        assert.equal(0, infoExtraction[4].waiters_for_day)

        assert.equal("Saturday", infoExtraction[5].weekday)
        assert.equal(0, infoExtraction[5].waiters_for_day)

        assert.equal("Sunday", infoExtraction[6].weekday)
        assert.equal(0, infoExtraction[6].waiters_for_day)
        //console.log(infoExtraction)
    });
});

describe('shiftsAndDayMatcher function', function () {
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
        let accountDataThree = {
            username: "Alex",
            password: "Qwerty",
            email: "alex@gmail.com"
        }
        let accountDataFour = {
            username: "Zahne",
            password: "Qwerty",
            email: "zahne@gmail.com"
        }
        await loginsFactory.createAccount(accountData)
        await loginsFactory.createAccount(accountDataTwo)
        await loginsFactory.createAccount(accountDataThree)
        await loginsFactory.createAccount(accountDataFour)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        let idForFirstAccount = accountExtraction[0].id
        let idForSecondAccount = accountExtraction[1].id
        let idForThirdAccount = accountExtraction[2].id
        let idForFourthAccount = accountExtraction[3].id
        await waitersFactory.shiftsPopulator("Sunday", idForFirstAccount)
        await waitersFactory.shiftsPopulator("Monday", idForFirstAccount)
        await waitersFactory.shiftsPopulator("Wednesday", idForFirstAccount)
        await waitersFactory.shiftsPopulator("Tuesday", idForFirstAccount)

        await waitersFactory.shiftsPopulator("Sunday", idForSecondAccount)
        await waitersFactory.shiftsPopulator("Wednesday", idForSecondAccount)
        await waitersFactory.shiftsPopulator("Tuesday", idForSecondAccount)

        await waitersFactory.shiftsPopulator("Sunday", idForThirdAccount)
        await waitersFactory.shiftsPopulator("Wednesday", idForThirdAccount)
        await waitersFactory.shiftsPopulator("Tuesday", idForThirdAccount)

        await waitersFactory.shiftsPopulator("Sunday", idForFourthAccount)
        let waitersExtraction = await loginsFactory.waitersTestAssistant()
        //let error = await waitersFactory.errorTestAssistant()
        assert.equal(11, waitersExtraction.length)
        await waitersFactory.dayCounter()
        let waiterAvailabilityByColor = await waitersFactory.shiftsAndDayMatcher()
        assert.equal("green", waiterAvailabilityByColor[1].style)
        assert.equal("green", waiterAvailabilityByColor[2].style)
        assert.equal("red", waiterAvailabilityByColor[6].style)
    });
});

after(function () {
    pool.end();
})