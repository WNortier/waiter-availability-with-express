module.exports = function WaitersRoutes(waitersFactory, loginsFactory) {

    async function getWorkdays(req, res, next) {
        try {
            const aWorkDaySubmission = req.body.workday
            if (aWorkDaySubmission == undefined) {
                var warning = "No day Selected!"
                req.flash('info', warning)
                res.render("staff/waiters", {
                    accountInfo: await loginsFactory.dataRerenderer_After_WorkdaySubmission_Or_Reset(req.params.email),
                    workDays: await waitersFactory.workingDaysDisplayer(req.params.id)
                });
            } else if (aWorkDaySubmission !== "") {
                await waitersFactory.waiterTable_Username_WeekdaysWorking_ForeignKeyPopulator(aWorkDaySubmission, req.params.id);
                await waitersFactory.weekdaysWorking_OnWaiterTableCounter();
                req.flash('info', errorMessage)
                res.render("staff/waiters", {
                    accountInfo: await loginsFactory.dataRerenderer_After_WorkdaySubmission_Or_Reset(req.params.email),
                    workDays: await waitersFactory.workingDaysDisplayer(req.params.id)
                });
            }
        } catch (err) {
            next(err);
        }
    }

    async function getWaiterReset(req, res, next) {
        try {
            await waitersFactory.removeShiftsForUser(req.params.id)
            await waitersFactory.weekdaysWorking_OnWaiterTableCounter()
            res.render("staff/waiters", {
                accountInfo: await loginsFactory.dataRerenderer_After_WorkdaySubmission_Or_Reset(req.params.email)
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