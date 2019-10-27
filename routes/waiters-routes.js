module.exports = function WaitersRoutes(waitersFactory, loginsFactory) {

    async function getWorkdays(req, res, next) {
        try {
            let aWorkDaySubmission = req.body.workday 
            let idPart = req.params.id
            let emailPart = req.params.email
            if (aWorkDaySubmission == undefined){
                var warning = "No day Selected!"
                req.flash('info', warning) 
                res.render("staff/waiters", {
                    accountInfo: await loginsFactory.login(emailPart),
                    workDays: await waitersFactory.workingDaysDisplayer(idPart)
                });
            } else if (aWorkDaySubmission !== ""){
            await waitersFactory.shiftsPopulator(aWorkDaySubmission, idPart);
            await waitersFactory.dayCounter();
            req.flash('info', errorMessage)
            res.render("staff/waiters", {
                accountInfo: await loginsFactory.login(emailPart),
               workDays: await waitersFactory.workingDaysDisplayer(idPart)
            });
        }
        } catch (err) {
            next(err);
        }
    }

    async function getWaiterReset(req, res, next) {
        try {
            let idPart = Number(req.params.id);
            console.log(idPart)
            let emailPart = req.params.email
            await waitersFactory.removeShiftsForUser(idPart)
            await waitersFactory.dayCounter()
            res.render("staff/waiters", {
                accountInfo: await loginsFactory.login(emailPart)
            });
        } catch (err) {
            next(err);
        }
    }

    return {
        getWorkdays,
        getWaiterReset
    }
}