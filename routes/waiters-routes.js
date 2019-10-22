module.exports = function WaitersRoutes(mockFactory) {



    async function getWorkdays(req, res, next) {
        try {
            let aWorkDaySubmission = req.body.workday
            console.log(aWorkDaySubmission)
            
            
            
            res.render("staff/waiters");
            // res.render("home", {
            //     test: mockFactory.helloWorld()
            // });
        } catch (err) {
            next(err);
        }
    }

    // async function aPostRoute(req, res, next) {
    //     try {
    //         let inputOne = req.body.anInput
    //         console.log(inputOne)
    //         let inputTwo = req.body.anotherInput
    //         console.log(inputTwo)
    //         res.redirect("/");
    //     } catch (err) {
    //         next(err);
    //     }
    // }

    return {
        getWorkdays
        // homeRoute,
        // aPostRoute
    }
}