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
        let emailArray = []; emailArray.push(account.email)
        let primaryKeyExtraction = await pool.query(`select * from accounts where email = $1`, emailArray);
        let foreignKey = primaryKeyExtraction.rows[primaryKeyExtraction.rowCount - 1].id
        let waiterArray = []; waiterArray[0] = account.username; waiterArray[1] = foreignKey 
        await pool.query(`insert into waiters (waiter_username, waiters_id) values ($1, $2)`, waiterArray);
        return true
    }

    async function login(email){
        let emailArray = []; emailArray.push(email)
        let waiterDataExtraction = await pool.query(`select * from accounts where email = $1`, emailArray)
        //console.log(waiterDataExtraction)
        return waiterDataExtraction.rows
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

    async function waitersTestAssistant() {
        let databaseWaiters = await pool.query(`SELECT * from waiters`);
        return databaseWaiters.rows;
    }

    async function infoTestAssistant() {
        let databaseInfo = await pool.query(`SELECT * from info`);
        return databaseInfo.rows;
    }

    return {
        // passwordHasher,
        // passwordComparer,
        createAccount,
        login,
        reset,
        accountsTestAssistant,
        waitersTestAssistant,
        infoTestAssistant
    }
}