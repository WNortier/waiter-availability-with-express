module.exports = function LoginsRoutes(loginsFactory) {

    // function sendRoute(req, res, err) {
    //     res.send("Basic ExpressJS Server Template");
    // }

    async function home(req, res, next) {
        try {
            res.render("home", {
                test: loginsFactory.helloWorld()
            });
        } catch (err) {
            next(err);
        }
    }

    async function login(req, res, next) {
        try {
            let inputOne = req.body.anInput
            console.log(inputOne)
            await loginsFactory.passwordHasher(inputOne);           
            let inputTwo = req.body.anotherInput
            console.log(inputTwo)
            // if (inputOne == "a"){
            //     res.render("waiters")
            // } else {
            //     res.render("manager")
            // }
            res.redirect("/")
        } catch (err) {
            next(err);
        }
    }

    async function about(req, res, next) {
        try {
            res.render("about");
        } catch (err) {
            next(err);
        }
    }

    async function returnHome(req, res, next) {
        try {
            res.redirect("/");
        } catch (err) {
            next(err);
        }
    }

    async function create(req, res, next) {
        try {
            res.render("create");
        } catch (err) {
            next(err);
        }
    }

    return {
        //send,
        home,
        login,
        about,
        returnHome,
        create
    }
}