module.exports = function LoginsFactory(pool) {
    var bcrypt = require('bcryptjs');

    async function createAccount(account) {
        errorMessage = "";
        //username scrutinizer 
        let usernameScrutinizer = /^[A-Z]+$/i
        let usernameScrutinizerResult = usernameScrutinizer.test(account.username);
        //username scrutinizer 
        let emailScrutinizer = /^[^\d\s]+@[^\d\s]+(.co.za|.com)$/i
        let emailScrutinizerResult = emailScrutinizer.test(account.email)
        //username scrutinizer 
        let passwordScrutinizer = /^[A-Z\d]{7,25}$/i
        let passwordScrutinizerResult = passwordScrutinizer.test(account.password)
        //rowCount for duplicate checking
        let userDataExtraction = await pool.query(`select * from accounts where email = $1`, [account.email])
        let userDataRowCount = userDataExtraction.rowCount
        //username is wrong 
        if (usernameScrutinizerResult == false && emailScrutinizerResult == true && passwordScrutinizerResult == true) {
            errorMessage = "You have entered an invalid username!";
            return false
        //email is wrong 
        } else if (emailScrutinizerResult == false && usernameScrutinizerResult == true && passwordScrutinizerResult == true) {
            errorMessage = "You have entered an invalid email address!"
            return false
        }
        //password is wrong
        else if (passwordScrutinizerResult == false && usernameScrutinizerResult == true && emailScrutinizerResult == true) {
            errorMessage = "You have entered an invalid password(minimum 7chars)!"
            return false
        }
        //username and email is wrong
        else if (usernameScrutinizerResult == false && emailScrutinizerResult == false && emailScrutinizerResult == true) {
            errorMessage = "You have entered an invalid username and email address!"
            return false
        }
        //email and password is wrong
        else if (emailScrutinizerResult == false && passwordScrutinizerResult == false && usernameScrutinizerResult == true) {
            errorMessage = "You have entered an invalid email address and password(minimum 7chars)!"
            return false
        }
        //username and password is wrong 
        else if (usernameScrutinizerResult == false && passwordScrutinizerResult == false && emailScrutinizerResult == true) {
            errorMessage = "You have entered an invalid username and password(minimum 7chars)!"
            return false
        } else if (usernameScrutinizerResult == false && passwordScrutinizerResult == false && emailScrutinizerResult == false) {
            errorMessage = "You have entered an invalid username, email and password(minimum 7chars)!"
            return false
        //account already exists
        } else if (usernameScrutinizerResult == true && passwordScrutinizerResult == true && emailScrutinizerResult == true && userDataRowCount > 0) {
            errorMessage = "That account already exists!"
            return false
        }
        //if everything checks out -> do the following
        else if (usernameScrutinizerResult == true && emailScrutinizerResult == true && passwordScrutinizerResult == true && userDataRowCount == 0) {
            let hashedpass = "";
            await bcrypt.hash(account.password, 11).then(hashedpassForRoutes => {
                hashedpass = hashedpassForRoutes
                return hashedpassForRoutes
            });
            let AccountCreationDate = new Date()
            formattedName = account.username.charAt(0).toUpperCase() + (account.username.slice(1)).toLowerCase();
            // let email = account.email
            // formattedEmail = email.toLowerCase()

            let accountData = [
                formattedName,
                account.email,
                hashedpass,
                AccountCreationDate
            ];
            await pool.query(`insert into accounts(username, email, password, date_created) values ($1, $2, $3, $4)`, accountData);
            let emailArray = [];
            emailArray.push(account.email)
            let primaryKeyExtraction = await pool.query(`select * from accounts where email = $1`, emailArray);
            let foreignKey = primaryKeyExtraction.rows[primaryKeyExtraction.rowCount - 1].id
            let waiterArray = [];
            waiterArray[0] = account.username;
            waiterArray[1] = foreignKey
            errorMessage = "Account created! You may now login..."
            return true
        }
    }

    async function login(email, loginPassword) {
        errorMessage = "";
        let userDataExtraction = await pool.query(`select * from accounts where email = $1`, [email])
        let userDataRowCount = userDataExtraction.rowCount
        let userData = userDataExtraction.rows
        if (userDataRowCount == 0) {
            errorMessage = "That account does not exist!"
            return false
        } else if (userDataRowCount > 0) {
            let userHashedPassword = userData[0].password
            const comparisonResult = await new Promise((resolve, reject) => {
                bcrypt.compare(String(loginPassword), String(userHashedPassword), function (err, res) {
                    if (err) reject(err)
                    resolve(res)
                });
            })
            //console.log(comparisonResult)
            if (comparisonResult == false) {
                errorMessage = "That password does not match our records!"
                return false
            } else if (userDataRowCount > 0 && comparisonResult == true) {
                //Comparing passwords
                let userDataExtraction = await pool.query(`select * from accounts where email = $1`, [email])
                let userData = userDataExtraction.rows
                //Calculate date of Monday and date of Sunday for the coming week
                var currentDay = new Date();
                var currentWeekDay = currentDay.getDay();
                var lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
                var wkStart = new Date(new Date(currentDay).setDate(currentDay.getDate() - (lessDays - 7))); //subtracted 7
                var wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
                var wkStartSubString = String(wkStart).substring(0, 10);
                var wkEndSubString = String(wkEnd).substring(0, 10);
                userData[0].weekStart = wkStartSubString
                userData[0].weekEnd = wkEndSubString
                return userData
            }
        }

    }

    async function dataRerenderer_After_WorkdaySubmission_Or_Reset(email) {
        let userDataExtraction = await pool.query(`select * from accounts where email = $1`, [email])
        let userData = userDataExtraction.rows
        //Calculate date of Monday and date of Sunday for the coming week
        var currentDay = new Date();
        var currentWeekDay = currentDay.getDay();
        var lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
        var wkStart = new Date(new Date(currentDay).setDate(currentDay.getDate() - (lessDays - 7))); //subtracted 7
        var wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
        var wkStartSubString = String(wkStart).substring(0, 10);
        var wkEndSubString = String(wkEnd).substring(0, 10);
        userData[0].weekStart = wkStartSubString
        userData[0].weekEnd = wkEndSubString
        return userData
    }

    async function resetShifts() {
        await pool.query(`delete from info`)
        await pool.query(`delete from waiters`)
    }

    async function resetInfo(){
        await pool.query(`delete from info`)
    }

    async function resetAccounts() {
        await pool.query(`delete from accounts`)
    }

    async function accountsTestAssistant() {
        let databaseAccounts = await pool.query(`SELECT * from accounts`);
        return databaseAccounts.rows;
    }

    async function waitersTestAssistant() {
        let databaseWaiters = await pool.query(`SELECT * from waiters`);
        return databaseWaiters.rows;
    }

    async function waiterInfoForManager() {
        let waitersAndDaysExtraction = await pool.query(`select waiter_username, array_agg(weekdays_working) as weekdays from waiters group by waiter_username`);
        let waitersAndDays = waitersAndDaysExtraction.rows
        return waitersAndDays
    }

    async function logoutRendererHelper(id){
        if (id){
        let userEmailExtraction = await pool.query(`select * from accounts where id = $1`, [id]) 
        console.log(userEmailExtraction.rows[0])
        return userEmailExtraction.rows[0]
    } else {
        return false
    }
    }

    return {
        createAccount,
        login,
        resetShifts,
        resetAccounts,
        accountsTestAssistant,
        waitersTestAssistant,
        waiterInfoForManager,
        dataRerenderer_After_WorkdaySubmission_Or_Reset,
        logoutRendererHelper,
        resetInfo
    }
}