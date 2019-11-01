module.exports = function LoginsFactory(pool) {
    var bcrypt = require('bcryptjs');
    let comparisonResult = "";

    // async function passwordHasher(password) {
    //    bcrypt.hash(password, 10, (err, hash) => {
    //         if (!err) {
    //             console.log(hash)
    //         } else {
    //             console.log("Error:", err)
    //         }
    //     })
    // }

    // async function passwordComparer(password, hashed) {
    //     bcrypt.compare(password, hashed, (err, res) => {
    //         if (!err) {
    //             console.log('Password Correct', res)
    //         } else {
    //             console.log("Error:", err)
    //         }
    //     })
    // }

    // async function passwordHasher(password) {
    //     return bcrypt.hash(password, 10).then(hashedpassForRoutes => {
    //         hashedpass = hashedpassForRoutes
    //         return hashedpass
    //     });
    // }

    // async function passwordComparer(password, hashed) {
    //     return bcrypt.compare(password, hashed).then(matchOrNoMatch => {
    //         comparisonResult = matchOrNoMatch;
    //         return comparisonResult
    //     });
    // }

    async function createAccount(account) {
        errorMessage = "";
        //username scrutinizer 
        formattedName = account.username.charAt(0).toUpperCase() + (account.username.slice(1)).toLowerCase();
        let name = account.username
        //console.log(name)
        let letterScrutinizer = /^[A-Z]+$/i
        let letterScrutinizerResult = letterScrutinizer.test(name);
        //console.log(letterScrutinizerResult)
        let emailScrutinizer = /^[^\d\s]+@[^\d\s]+\.(com)$/
        if (letterScrutinizerResult == false) {
            errorMessage = "You have entered an invalid name!";
            return false
        } else if (letterScrutinizerResult == true) {





            let hashedpass = "";
            await bcrypt.hash(account.password, 11).then(hashedpassForRoutes => {
                hashedpass = hashedpassForRoutes
                //csoneole.log(hashedpass)
                return hashedpassForRoutes
            });
            let AccountCreationDate = new Date()
            let accountData = [
                account.username,
                account.email,
                hashedpass,
                AccountCreationDate
            ];
            await pool.query(`insert into accounts(username, email, password, date_created) 
        values ($1, $2, $3, $4)`, accountData);
            let emailArray = [];
            emailArray.push(account.email)
            let primaryKeyExtraction = await pool.query(`select * from accounts where email = $1`, emailArray);
            let foreignKey = primaryKeyExtraction.rows[primaryKeyExtraction.rowCount - 1].id
            let waiterArray = [];
            waiterArray[0] = account.username;
            waiterArray[1] = foreignKey
            //await pool.query(`insert into waiters (waiter_username, waiters_id) values ($1, $2)`, waiterArray);
            return true
        }
    }

    async function login(email) {
        let emailArray = [];
        emailArray.push(email)
        let userDataExtraction = await pool.query(`select * from accounts where email = $1`, emailArray)
        let userData = userDataExtraction.rows
        //Calculate date of Monday and date of Sunday for current week
        var currentDay = new Date();
        var currentWeekDay = currentDay.getDay();
        var lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
        var wkStart = new Date(new Date(currentDay).setDate(currentDay.getDate() - (lessDays - 7))); //edited - multipled by two
        var wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6)); //edited added 7
        var wkStartSubString = String(wkStart).substring(0, 10);
        var wkEndSubString = String(wkEnd).substring(0, 10);
        userData[0].weekStart = wkStartSubString
        userData[0].weekEnd = wkEndSubString
        return userData
    }

    async function reset() {
        await pool.query(`delete from info`)
        await pool.query(`delete from waiters`)
        await pool.query(`delete from accounts`)
    }

    async function accountsTestAssistant() {
        let databaseAccounts = await pool.query(`SELECT * from accounts`);
        return databaseAccounts.rows;
    }

    // async function idForShifts(email) {
    //     let idExtraction = await pool.query(`SELECT * from accounts where email = $1`, [email])
    //     let theId = idExtraction.rows[0].id
    //     return theId
    // }

    async function waitersTestAssistant() {
        let databaseWaiters = await pool.query(`SELECT * from waiters`);
        return databaseWaiters.rows;
    }

    async function waiterInfoForManager() {
        let waitersAndDaysExtraction = await pool.query(`select waiter_username, array_agg(weekdays_working) as weekdays from waiters group by waiter_username`);
        let waitersAndDays = waitersAndDaysExtraction.rows
        console.log(waitersAndDays)
        return waitersAndDays
    }

    return {
        // passwordHasher,
        // passwordComparer,
        createAccount,
        login,
        reset,
        accountsTestAssistant,
        waitersTestAssistant,
        waiterInfoForManager,
        //idForShifts
    }
}

// let amountOfWaiters = Number(waitersNoDuplicates.length * 7)
// console.log(amountOfWaiters)