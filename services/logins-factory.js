module.exports = function LoginsFactory(pool) {
    var bcrypt = require('bcryptjs');
    let hashedpass = "";
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

    async function passwordHasher(password) {
        return bcrypt.hash(password, 10).then(hashedpassForRoutes => {
            hashedpass = hashedpassForRoutes
            return hashedpass
        });
    }

    async function passwordComparer(password, hashed) {
        return bcrypt.compare(password, hashed).then(matchOrNoMatch => {
            comparisonResult = matchOrNoMatch;
            return comparisonResult
        });
    }

    async function createAccount(account) {
        
        bcrypt.hash(account.password, 10).then(hashedpassForRoutes => {
                hashedpass = hashedpassForRoutes
                return hashedpass
            });
        

        var creationDate = new Date()
        var data = [
            account.username,
            hashedpass,
            account.email,
            creationDate
        ];

        return pool.query(`insert into accounts(username, email, password, date_created) 
        values ($1, $2, $3, $4)`, data);
    }

    async function reset() {
        await pool.query(`delete from info`)
        await pool.query(`delete from waiters`)
        await pool.query(`delete from accounts`)
    }


    return {
        passwordHasher,
        passwordComparer,
        createAccount,
        reset
    }
}