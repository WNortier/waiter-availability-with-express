module.exports = function LoginsFactory(pool) {
    var bcrypt = require('bcryptjs');

    async function helloWorld() {
        return "Hello World!"
    }

    async function passwordHasher(password) {
        bcrypt.hash(password, 10, (err, hash) => {
            if (!err) {
                console.log(hash)
            } else {
                console.log("Error:", err)
            }
        })
    }

    // bcrypt.genSalt(10, function(err, salt) {
    //     bcrypt.hash("B4c0/\/", salt, function(err, hash) {
    //         console.log(hash)
    //     });
    // });

    return {
        helloWorld,
        passwordHasher
    }
}