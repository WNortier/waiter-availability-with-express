module.exports = function MockRoutes(mockFactory) {

    // function sendRoute(req, res, err) {
    //     res.send("Basic ExpressJS Server Template");
    // }

    async function homeRoute(req, res, err) {
        try {
            res.render("home", {
                test: mockFactory.helloWorld()
            });
        } catch (err) {
            next(err);
        }
    }

    async function aPostRoute(req, res, err) {
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

    return {
        //sendRoute,
        homeRoute,
        aPostRoute
    }
}