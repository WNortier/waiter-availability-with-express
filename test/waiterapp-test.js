assert = require("assert");
const LoginsFactory = require("../services/logins-factory");
const WaitersFactory = require("../services/waiters-factory")
const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://warwick:pg123@localhost:5432/javascriptcafe_test';

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
    it('should return an error for incorrect username', async function () {
        let loginsFactory = LoginsFactory(pool)
        let waitersFactory = WaitersFactory(pool)
        let accountData = {
            username: "W@rwick",
            password: "Qwertyy",
            email: "warwick.nortier@gmail.com"
        }
        await loginsFactory.createAccount(accountData)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        assert.equal(0, accountExtraction.length);
        let error = await waitersFactory.errorTestAssistant()
        assert.equal("You have entered an invalid username!", error)
    });
    it('should return an error for incorrect email (no symbols or numbers and only .com or .co.za)', async function () {
        let loginsFactory = LoginsFactory(pool)
        let waitersFactory = WaitersFactory(pool)
        let accountData = {
            username: "Warwick",
            password: "Qwertyy",
            email: "w4rw1ck.n0rti%r@gmail.co.za"
        }
        await loginsFactory.createAccount(accountData)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        assert.equal(0, accountExtraction.length);
        let error = await waitersFactory.errorTestAssistant()
        assert.equal("You have entered an invalid email address!", error)
    });
    it('should return an error for invalid password', async function () {
        let loginsFactory = LoginsFactory(pool)
        let waitersFactory = WaitersFactory(pool)
        let accountData = {
            username: "Warwick",
            password: "Qwer#",
            email: "warwick.nortier@gmail.com"
        }
        await loginsFactory.createAccount(accountData)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        assert.equal(0, accountExtraction.length);
        let error = await waitersFactory.errorTestAssistant()
        assert.equal("You have entered an invalid password(minimum 7chars)!", error)
    });
    it('should return an error for invalid username and password', async function () {
        let loginsFactory = LoginsFactory(pool)
        let waitersFactory = WaitersFactory(pool)
        let accountData = {
            username: "Warw1ck",
            password: "Qwer#",
            email: "warwick.nortier@gmail.com"
        }
        await loginsFactory.createAccount(accountData)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        assert.equal(0, accountExtraction.length);
        let error = await waitersFactory.errorTestAssistant()
        assert.equal("You have entered an invalid username and password(minimum 7chars)!", error)
    });
    it('should return an error for invalid email address and password', async function () {
        let loginsFactory = LoginsFactory(pool)
        let waitersFactory = WaitersFactory(pool)
        let accountData = {
            username: "Warwick",
            password: "Qwer tyyyyyyy",
            email: "warwick.nortiergmail.com"
        }
        await loginsFactory.createAccount(accountData)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        assert.equal(0, accountExtraction.length);
        let error = await waitersFactory.errorTestAssistant()
        assert.equal("You have entered an invalid email address and password(minimum 7chars)!", error)
    });
    it('should return an error for invalid username and password', async function () {
        let loginsFactory = LoginsFactory(pool)
        let waitersFactory = WaitersFactory(pool)
        let accountData = {
            username: "W@rwick",
            password: "Qwer#",
            email: "warwick.nortier@gmail.com"
        }
        await loginsFactory.createAccount(accountData)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        assert.equal(0, accountExtraction.length);
        let error = await waitersFactory.errorTestAssistant()
        assert.equal("You have entered an invalid username and password(minimum 7chars)!", error)
    });
    it('should return an error for invalid username, password and email', async function () {
        let loginsFactory = LoginsFactory(pool)
        let waitersFactory = WaitersFactory(pool)
        let accountData = {
            username: "W@rwick",
            password: "Qwer#",
            email: "warwick@gm4il.com"
        }
        await loginsFactory.createAccount(accountData)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        assert.equal(0, accountExtraction.length);
        let error = await waitersFactory.errorTestAssistant()
        assert.equal("You have entered an invalid username, email and password(minimum 7chars)!", error)
    });
    it('should return an error if the account already exists', async function () {
        let loginsFactory = LoginsFactory(pool)
        let waitersFactory = WaitersFactory(pool)
        let accountData = {
            username: "Warwick",
            password: "Qwertyyyy",
            email: "warwick@gmail.com"
        }
        await loginsFactory.createAccount(accountData)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        assert.equal(1, accountExtraction.length);
        await loginsFactory.createAccount(accountData)
        let error = await waitersFactory.errorTestAssistant()
        assert.equal("That account already exists!", error)
    });

    it('should populate the accounts table with a new user account that has a unique id and email address', async function () {
        let loginsFactory = LoginsFactory(pool)
        let accountData = {
            username: "Warwick",
            password: "qwertyyyy",
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
    it('should populate the accounts table with multiple users with their unique id(s) and email address(s)', async function () {
        let loginsFactory = LoginsFactory(pool)
        let accountDataOne = {
            username: "Warwick",
            password: "Qwertyy",
            email: "warwick.nortier@gmail.com"
        }
        let accountDataTwo = {
            username: "Frank",
            password: "Qwertyy",
            email: "frank@gmail.com"
        }
        let accountDataThree = {
            username: "Josie",
            password: "Qwertyy",
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
    it('should return an error if the account does not exist', async function () {
        let loginsFactory = LoginsFactory(pool)
        let waitersFactory = WaitersFactory(pool)
        await loginsFactory.login("warwick.nortier@gmail.com", "Qwertyy")
        let error = await waitersFactory.errorTestAssistant()
        assert.equal("That account does not exist!", error)
    });
    it('should return all account data on the user logging in for rendering purposes', async function () {
        let loginsFactory = LoginsFactory(pool)
        let accountData = {
            username: "Warwick",
            password: "Qwertyy",
            email: "warwick.nortier@gmail.com"
        }
        await loginsFactory.createAccount(accountData)
        let loginData = await loginsFactory.login("warwick.nortier@gmail.com", "Qwertyy")
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        let idForFirstAccount = accountExtraction[0].id
        assert.equal("Warwick", loginData[0].username)
        assert.equal("warwick.nortier@gmail.com", loginData[0].email)
        assert.equal(idForFirstAccount, loginData[0].id)
    });
});

describe('waiterTablePopulatorUsingArray function', function () {
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
            password: "Qwertyy",
            email: "warwick.nortier@gmail.com"
        }
        let accountDataTwo = {
            username: "Frank",
            password: "Qwertyy",
            email: "frank@gmail.com"
        }
        await loginsFactory.createAccount(accountData)
        await loginsFactory.createAccount(accountDataTwo)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        let idForFirstAccount = accountExtraction[0].id
        let idForSecondAccount = accountExtraction[1].id
        await waitersFactory.waiterTablePopulatorUsingArray(["Monday"], idForFirstAccount)
            .then(await waitersFactory.waiterTablePopulatorUsingArray(["Tuesday"], idForFirstAccount))
            .then(await waitersFactory.waiterTablePopulatorUsingArray(["Sunday"], idForSecondAccount))
            .then(await waitersFactory.waiterTablePopulatorUsingArray(["Wednesday"], idForFirstAccount))
            .then(await waitersFactory.waiterTablePopulatorUsingArray(["Thursday"], idForFirstAccount))
            .then(await waitersFactory.waiterTablePopulatorUsingArray(["Friday"], idForFirstAccount))
            .then(await waitersFactory.waiterTablePopulatorUsingArray(["Saturday"], idForFirstAccount))
            .then(await waitersFactory.waiterTablePopulatorUsingArray(["Sunday"], idForFirstAccount))
        let waitersExtraction = await loginsFactory.waitersTestAssistant()
        assert.equal(8, waitersExtraction.length)
        assert.equal("Frank", waitersExtraction[2].waiter_username)
    });
    it('should populate the waiters table based on workdays selected and prevent duplicate days', async function () {
        let loginsFactory = LoginsFactory(pool)
        let waitersFactory = WaitersFactory(pool)
        let accountData = {
            username: "Warwick",
            password: "Qwertyy",
            email: "warwick.nortier@gmail.com"
        }
        await loginsFactory.createAccount(accountData)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        let idForFirstAccount = accountExtraction[0].id
        await waitersFactory.waiterTablePopulatorUsingArray(["Monday"], idForFirstAccount)
        await waitersFactory.waiterTablePopulatorUsingArray(["Monday"], idForFirstAccount)
        let waitersExtraction = await loginsFactory.waitersTestAssistant()
        let error = await waitersFactory.errorTestAssistant()
        assert.equal(1, waitersExtraction.length)
        assert.equal("We've already received some of those workdays!", error)
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
            password: "Qwertyy",
            email: "warwick.nortier@gmail.com"
        }
        let accountDataTwo = {
            username: "Frank",
            password: "Qwertyy",
            email: "frank@gmail.com"
        }
        await loginsFactory.createAccount(accountData)
        await loginsFactory.createAccount(accountDataTwo)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        let idForFirstAccount = accountExtraction[0].id
        let idForSecondAccount = accountExtraction[1].id
        await waitersFactory.waiterTablePopulatorUsingArray(["Monday"], idForFirstAccount)
            .then(await waitersFactory.waiterTablePopulatorUsingArray(["Tuesday"], idForFirstAccount))
            .then(await waitersFactory.waiterTablePopulatorUsingArray(["Sunday"], idForSecondAccount))
            .then(await waitersFactory.waiterTablePopulatorUsingArray(["Wednesday"], idForFirstAccount))
            .then(await waitersFactory.waiterTablePopulatorUsingArray(["Thursday"], idForFirstAccount))
            .then(await waitersFactory.waiterTablePopulatorUsingArray(["Friday"], idForFirstAccount))
            .then(await waitersFactory.waiterTablePopulatorUsingArray(["Saturday"], idForFirstAccount))
            .then(await waitersFactory.waiterTablePopulatorUsingArray(["Sunday"], idForFirstAccount))
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
            password: "Qwertyy",
            email: "warwick.nortier@gmail.com"
        }
        await loginsFactory.createAccount(accountData)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        let idForFirstAccount = accountExtraction[0].id
        await waitersFactory.waiterTablePopulatorUsingArray(["Monday"], idForFirstAccount)
            .then(await waitersFactory.waiterTablePopulatorUsingArray(["Tuesday"], idForFirstAccount))
            .then(await waitersFactory.waiterTablePopulatorUsingArray(["Wednesday"], idForFirstAccount))
            .then(await waitersFactory.waiterTablePopulatorUsingArray(["Thursday"], idForFirstAccount))
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
            password: "Qwertyy",
            email: "warwick.nortier@gmail.com"
        }
        let accountDataTwo = {
            username: "Frank",
            password: "Qwertyy",
            email: "frank@gmail.com"
        }
        await loginsFactory.createAccount(accountData)
        await loginsFactory.createAccount(accountDataTwo)
        let accountExtraction = await loginsFactory.accountsTestAssistant()
        let idForFirstAccount = accountExtraction[0].id
        let idForSecondAccount = accountExtraction[1].id
        await waitersFactory.waiterTablePopulatorUsingArray(["Monday"], idForFirstAccount)
        await waitersFactory.waiterTablePopulatorUsingArray(["Monday"], idForSecondAccount)
        await waitersFactory.waiterTablePopulatorUsingArray(["Tuesday"], idForFirstAccount)
        let waitersExtraction = await loginsFactory.waitersTestAssistant()
        assert.equal(3, waitersExtraction.length)
        await waitersFactory.weekdaysWorking_OnWaiterTableCounter()
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
            password: "Qwertyy",
            email: "warwick.nortier@gmail.com"
        }
        let accountDataTwo = {
            username: "Frank",
            password: "Qwertyy",
            email: "frank@gmail.com"
        }
        let accountDataThree = {
            username: "Alex",
            password: "Qwertyy",
            email: "alex@gmail.com"
        }
        let accountDataFour = {
            username: "Zahne",
            password: "Qwertyy",
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
        await waitersFactory.waiterTablePopulatorUsingArray(["Sunday"], idForFirstAccount)
        await waitersFactory.waiterTablePopulatorUsingArray(["Monday"], idForFirstAccount)
        await waitersFactory.waiterTablePopulatorUsingArray(["Wednesday"], idForFirstAccount)
        await waitersFactory.waiterTablePopulatorUsingArray(["Tuesday"], idForFirstAccount)

        await waitersFactory.waiterTablePopulatorUsingArray(["Sunday"], idForSecondAccount)
        await waitersFactory.waiterTablePopulatorUsingArray(["Wednesday"], idForSecondAccount)
        await waitersFactory.waiterTablePopulatorUsingArray(["Tuesday"], idForSecondAccount)

        await waitersFactory.waiterTablePopulatorUsingArray(["Sunday"], idForThirdAccount)
        await waitersFactory.waiterTablePopulatorUsingArray(["Wednesday"], idForThirdAccount)
        await waitersFactory.waiterTablePopulatorUsingArray(["Tuesday"], idForThirdAccount)

        await waitersFactory.waiterTablePopulatorUsingArray(["Sunday"], idForFourthAccount)
        let waitersExtraction = await loginsFactory.waitersTestAssistant()
        //let error = await waitersFactory.errorTestAssistant()
        assert.equal(11, waitersExtraction.length)
        await waitersFactory.weekdaysWorking_OnWaiterTableCounter()
        let waiterAvailabilityByColor = await waitersFactory.shiftsAndDayMatcher()
        assert.equal("green", waiterAvailabilityByColor[1].style)
        assert.equal("green", waiterAvailabilityByColor[2].style)
        assert.equal("red", waiterAvailabilityByColor[6].style)
    });
});

after(function () {
    pool.end();
})