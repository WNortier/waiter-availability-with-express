module.exports = function WaitersRoutes(waitersFactory, loginsFactory) {

    async function getWorkdays(req, res, next) {
        try {
            let aWorkDayArray = req.body.workday

            if (aWorkDayArray == undefined) {
                var warning = "No input selected!"
                req.flash('info', warning)
                res.render("staff/waiters", {
                    accountInfo: await loginsFactory.dataRerenderer_After_WorkdaySubmission_Or_Reset(req.params.email),
                    workDays: await waitersFactory.workingDaysDisplayer(req.params.id),
                    displayLogout: await loginsFactory.logoutRendererHelper(req.session.userId)
                });
            } else if (aWorkDayArray !== "") {
                if (typeof aWorkDayArray == "string") {
                    let singleWorkdayArray = []
                    singleWorkdayArray.push(aWorkDayArray)
                    console.log(typeof singleWorkdayArray)
                    await waitersFactory.waiterTablePopulatorUsingArray(singleWorkdayArray, req.params.id);
                    await waitersFactory.weekdaysWorking_OnWaiterTableCounter();
                    req.flash('info', errorMessage)
                    res.render("staff/waiters", {
                        accountInfo: await loginsFactory.dataRerenderer_After_WorkdaySubmission_Or_Reset(req.params.email),
                        workDays: await waitersFactory.workingDaysDisplayer(req.params.id),
                        displayLogout: await loginsFactory.logoutRendererHelper(req.session.userId)
                    });
                } else {
                    //console.log(aWorkDayArray)
                    await waitersFactory.waiterTablePopulatorUsingArray(aWorkDayArray, req.params.id);
                    await waitersFactory.weekdaysWorking_OnWaiterTableCounter();
                    req.flash('info', errorMessage)
                    res.render("staff/waiters", {
                        accountInfo: await loginsFactory.dataRerenderer_After_WorkdaySubmission_Or_Reset(req.params.email),
                        workDays: await waitersFactory.workingDaysDisplayer(req.params.id),
                        displayLogout: await loginsFactory.logoutRendererHelper(req.session.userId)
                    });
                }
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
                accountInfo: await loginsFactory.dataRerenderer_After_WorkdaySubmission_Or_Reset(req.params.email),
                displayLogout: await loginsFactory.logoutRendererHelper(req.session.userId)
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