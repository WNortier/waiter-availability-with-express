module.exports = function LoginsRoutes(loginsFactory) {

    // function sendRoute(req, res, err) {
    //     res.send("Basic ExpressJS Server Template");
    // }

    async function primary(req, res, next) {
        try {
            res.render("home", {
                test: loginsFactory.helloWorld()
            });
        } catch (err) {
            next(err);
        }
    }

    async function aPostRoute(req, res, next) {
        try {
            let inputOne = req.body.anInput
            console.log(inputOne)
            let inputTwo = req.body.anotherInput
            console.log(inputTwo)
            res.redirect("/");
        } catch (err) {
            next(err);
        }
    }

    async function aboutRoute(req, res, next) {
        try {
            res.render("about");
        } catch (err) {
            next(err);
        }
    }

    async function homeRoute(req, res, next) {
        try {
            res.redirect("/");
        } catch (err) {
            next(err);
        }
    }

    return {
        //sendRoute,
        primary,
        aPostRoute,
        aboutRoute,
        homeRoute
    }
}