module.exports = function WaitersRoutes(waitersFactory, loginsFactory) {



    async function getWorkdays(req, res, next) {
        try {
            let aWorkDaySubmission = req.body.workday
            let waitersInfo = req.params.id
            let idPart = waitersInfo.substring(0, 3);
            let emailPart = waitersInfo.slice(3);
            console.log(aWorkDaySubmission)
            console.log(idPart)
            await waitersFactory.shiftsPopulator(aWorkDaySubmission, idPart);
            await waitersFactory.dayCounter();
            
            res.render("staff/waiters", {
                accountInfo: await loginsFactory.login(emailPart)
              });
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