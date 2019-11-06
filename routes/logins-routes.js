module.exports = function LoginsRoutes(waitersFactory, loginsFactory, pool) {


    async function home(req, res, next) {
        try {
            res.render("home");
        } catch (err) {
            next(err);
        }
    }

    async function displayAbout(req, res, next) {
        try {
            res.render("logins/about");
        } catch (err) {
            next(err);
        }
    }

    // async function logoutRenderer(req, res, next) {
    //     try {
    //         console.log(req.body.email)
    //         //await pool.queryconsole.log(req.session.userId)
    //         //console.log(req.session.userId)
    //         var userDataAccountExtraction = await pool.query(`select * from accounts where email = $1`, [req.body.email])
    //         var userDataAccount = userDataAccountExtraction.rows
    //         req.session.userId = userDataAccount[0].id
    //         console.log(req.session.userId)

    //         if (req.session.userId) {
    //             res.render(`layouts/main`, {
                    
    //             });
    //         } else {
    //             return false
    //         }
    //     } catch (err) {
    //         next(err);
    //     }
    // }

    async function getLogin(req, res, next) {
        try {
            console.log(req.body)
            if (req.body.email == "" || req.body.password == "") {
                req.flash('info', "Please complete all login fields!")
                res.redirect('/')
            } else if (req.body.email !== "" && req.body.password !== "") {

                var loginResult = await loginsFactory.login(req.body.email, req.body.password)
            }
            if (loginResult == false) {
                req.flash('info', errorMessage)
                res.redirect('/')
            } else if (loginResult !== false && req.body.email !== "admin@gmail.com") {
                var userDataAccountsExtraction = await pool.query(`select * from accounts where email = $1`, [req.body.email])
                let userDataAccounts = userDataAccountsExtraction.rows
                let userDataAccountsId = userDataAccounts[0].id
                req.session.userId = userDataAccountsId
                var waiterDataExtraction = await pool.query(`select * from waiters where waiters_id = $1`, [userDataAccountsId])
                if (waiterDataExtraction.rowCount > 0) {
                    res.render("staff/waiters", {
                        accountInfo: await loginsFactory.login(req.body.email, req.body.password),
                        workDays: await waitersFactory.workingDaysDisplayer(userDataAccountsId),
                        displayLogout: await loginsFactory.logoutRendererHelper(req.session.userId)
                    });
                } else if (waiterDataExtraction.rowCount == 0) {
                    res.render("staff/waiters", {
                        accountInfo: await loginsFactory.login(req.body.email, req.body.password),
                        displayLogout: await loginsFactory.logoutRendererHelper(req.session.userId)
                    });
                }
            } else if (loginResult !== false && req.body.email == "admin@gmail.com" && req.body.email !== "" && req.body.password !== "") {
                var userDataAccountsExtraction = await pool.query(`select * from accounts where email = $1`, [req.body.email])
                let userDataAccounts = userDataAccountsExtraction.rows
                let userDataAccountsId = userDataAccounts[0].id
                req.session.userId = userDataAccountsId
                //await logoutRenderer(req.session.userId)
                res.render("staff/manager", {
                    accountInfo: await loginsFactory.login(req.body.email, req.body.password),
                    shiftDays: await waitersFactory.shiftsAndDayMatcher(),
                    workDaysInfo: await loginsFactory.waiterInfoForManager(),
                    displayLogout: await loginsFactory.logoutRendererHelper(req.session.userId)
                });
            }
        } catch (err) {
            next(err);
        }
    }

    async function getLogout(req, res, next) {
        try {


            if (req.params.email !== undefined && req.params.email.startsWith("admin")) {
                req.session.destroy(err => {
                    if (err) {
                        return res.redirect('staff/manager')
                    }
                    res.clearCookie('sid')
                    res.redirect('/')
                })
            } else if (req.params.email == undefined) {
                req.session.destroy(err => {
                    if (err) {
                        return res.redirect('staff/manager')
                    }
                    res.clearCookie('sid')
                    res.redirect('/')
                });
            } else {
                req.session.destroy(err => {
                    if (err) {
                        return res.redirect('staff/waiters')
                    }
                    res.clearCookie('sid')
                    res.redirect('/')
                })
            }
        } catch (err) {
            next(err);
        }
    }

    async function returnHome(req, res, next) {
        try {
            if (req.session.userId) {
                var userDataAccountsExtraction = await pool.query(`select * from accounts where id = $1`, [req.session.userId])
                let userDataAccounts = userDataAccountsExtraction.rows
                let userDataAccountsEmail = userDataAccounts[0].email

                if (req.session.userId && userDataAccountsEmail.startsWith("admin")) {
                    res.render("staff/manager", {
                        accountInfo: await loginsFactory.dataRerenderer_After_WorkdaySubmission_Or_Reset(userDataAccountsEmail),
                        shiftDays: await waitersFactory.shiftsAndDayMatcher(),
                        workDaysInfo: await loginsFactory.waiterInfoForManager(),
                        displayLogout: await loginsFactory.logoutRendererHelper(req.session.userId)
                    });
                } else if (req.session.userId && userDataAccountsEmail.startsWith("admin") == false) {
                    res.render("staff/waiters", {
                        accountInfo: await loginsFactory.dataRerenderer_After_WorkdaySubmission_Or_Reset(userDataAccountsEmail),
                        workDays: await waitersFactory.workingDaysDisplayer(req.session.userId),
                        displayLogout: await loginsFactory.logoutRendererHelper(req.session.userId)
                    });
                }
            } else {
                res.redirect("/");
            }
        } catch (err) {
            next(err);
        }
    }

    

    async function displayCreateAccount(req, res, next) {
        try {
            res.render("logins/create");
        } catch (err) {
            next(err);
        }
    }

    async function getCreateAccount(req, res, next) {
        try {
            if (req.body.username !== "" && req.body.password !== "" && req.body.email !== "") {
                const successBoolean = await loginsFactory.createAccount({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email
                });
                if (successBoolean == false) {
                    req.flash('info', errorMessage)
                    res.redirect("/displayCreateAccount")
                } else if (successBoolean == true) {
                    req.flash('created', errorMessage)
                    res.redirect('/')
                }
            } else if (req.body.username == "" || req.body.password == "" || req.body.email == "") {
                req.flash('info', "Please complete all input fields!")
                res.redirect("/displayCreateAccount")
            }
        } catch (err) {
            next(err);
        }
    }

    async function getShiftsReset(req, res, next) {
        try {
            await loginsFactory.resetShifts()
            res.render("staff/manager", {
                accountInfo: await loginsFactory.dataRerenderer_After_WorkdaySubmission_Or_Reset(req.params.email),
                shiftDays: await waitersFactory.shiftsAndDayMatcher(),
                workDaysInfo: await loginsFactory.waiterInfoForManager(),
                displayLogout: await loginsFactory.logoutRendererHelper(req.session.userId),
                dayCounts: await waitersFactory.weekdaysWorking_OnWaiterTableCounter(),
                resetInfo: await loginsFactory.resetInfo()
            });
        } catch (err) {
            next(err)
        }
    }

    async function getAccountsReset(req, res, next) {
        try {
            let databaseWaiters = await pool.query(`SELECT * from waiters`);
            let databaseInfo = await pool.query(`SELECT * from Info`);
            let databaseWaitersRows = databaseWaiters.rowCount
            let databaseInfoRows = databaseInfo.rowCount
            if (databaseInfoRows > 0 && databaseWaitersRows > 0) {
                res.render("staff/manager", {
                    shiftDays: await waitersFactory.shiftsAndDayMatcher(),
                    workDaysInfo: await loginsFactory.waiterInfoForManager(),
                    dayCounts: await waitersFactory.weekdaysWorking_OnWaiterTableCounter()
                });
            } else if (databaseInfoRows == 0 && databaseWaitersRows == 0) {
                await loginsFactory.resetAccounts()
                req.session.destroy(err => {
                    if (err) {
                        return res.redirect('staff/manager')
                    }
                    res.clearCookie('sid')
                    //console.log(req.session)
                    res.redirect('/')
                });
                // res.render("staff/manager", {
                //     shiftDays: await waitersFactory.shiftsAndDayMatcher(),
                //     workDaysInfo: await loginsFactory.waiterInfoForManager(),
                //     dayCounts: await waitersFactory.weekdaysWorking_OnWaiterTableCounter()
                // });
            }
        } catch (err) {
            next(err)
        }
    }

    return {
        home,
        returnHome,
        getLogin,
        displayAbout,
        displayCreateAccount,
        getCreateAccount,
        getShiftsReset,
        getAccountsReset,
        getLogout
        //logoutRenderer
    }
}