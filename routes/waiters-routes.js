module.exports = function WaitersRoutes(waitersFactory, loginsFactory) {

    async function getWorkdays(req, res, next) {
        try {
            let aWorkDaySubmission = req.body.workday 
            let idPart = req.params.id
            console.log(idPart)
            let emailPart = req.params.email
            console.log(emailPart)
            await waitersFactory.shiftsPopulator(aWorkDaySubmission, idPart);
            await waitersFactory.dayCounter();
            res.render("staff/waiters", {
                accountInfo: await loginsFactory.login(emailPart)
            });
        } catch (err) {
            next(err);
        }
    }

    async function getWaiterReset(req, res, next) {
        try {
            let waitersInfo = req.params.id
            let idPart = waitersInfo.substring(0, 3);
            let emailPart = waitersInfo.slice(3);
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