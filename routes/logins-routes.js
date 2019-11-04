module.exports = function LoginsRoutes(waitersFactory, loginsFactory, pool) {

    async function home(req, res, next) {
        try {
            res.render("home", {});
        } catch (err) {
            next(err);
        }
    }

    async function displayAbout(req, res, next) {
        try {
            res.render("logins/about");
            console.log(req.session)
        } catch (err) {
            next(err);
        }
    }

    async function getLogout(req, res, next) {
        try {


            if (req.params.email.startsWith("admin")) {
                req.session.destroy(err => {
                    if (err) {
                        return res.redirect('staff/manager')
                    }
                    res.clearCookie('sid')
                    console.log(req.session)
                    res.redirect('/')
                })
            } else
                req.session.destroy(err => {
                    if (err) {
                        return res.redirect('staff/waiters')
                    }
                    res.clearCookie('sid')
                    console.log(req.session)
                    res.redirect('/')
                })
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

                if (userDataAccountsEmail.startsWith("admin")) {
                    res.render("staff/manager", {
                        accountInfo: await loginsFactory.dataRerenderer_After_WorkdaySubmission_Or_Reset(userDataAccountsEmail),
                        shiftDays: await waitersFactory.shiftsAndDayMatcher(),
                        workDaysInfo: await loginsFactory.waiterInfoForManager()
                    });
                } else if (userDataAccountsEmail.startsWith("admin") == false) {
                    res.render("staff/waiters", {
                        accountInfo: await loginsFactory.dataRerenderer_After_WorkdaySubmission_Or_Reset(userDataAccountsEmail),
                        workDays: await waitersFactory.workingDaysDisplayer(req.session.userId)
                    });
                }
            } else {
                res.redirect("/");
            }
        } catch (err) {
            next(err);
        }
    }

    async function getLogin(req, res, next) {
        try {
            if (req.body.email == "" || req.body.password == "") {
                req.flash('info', "Please complete all login fields!")
                res.redirect('/')
            } else if (req.body.email !== "admin@gmail.com" && req.body.email !== "" && req.body.password !== "") {
                let loginResult = await loginsFactory.login(req.body.email, req.body.password)
                console.log(loginResult)
                if (loginResult == false) {
                    req.flash('info', errorMessage)
                    res.redirect('/')
                } else if (loginResult == true) {
                    var userDataAccountsExtraction = await pool.query(`select * from accounts where email = $1`, [req.body.email])
                    let userDataAccounts = userDataAccountsExtraction.rows
                    let userDataAccountsId = userDataAccounts[0].id
                    req.session.userId = userDataAccountsId
                    //console.log(req.session)
                    var waiterDataExtraction = await pool.query(`select * from waiters where waiters_id = $1`, [userDataAccountsId])
                    if (waiterDataExtraction.rowCount > 0) {
                        res.render("staff/waiters", {
                            accountInfo: await loginsFactory.login(req.body.email, req.body.password),
                            workDays: await waitersFactory.workingDaysDisplayer(userDataAccountsId)
                        });
                    } else if (waiterDataExtraction.rowCount == 0) {
                        res.render("staff/waiters", {
                            accountInfo: await loginsFactory.login(req.body.email, req.body.password)
                        });
                    }

                } else if (loginResult === true && req.body.email == "admin@gmail.com" && req.body.email !== "" && req.body.password !== "") {
                    res.render("staff/manager", {
                        accountInfo: await loginsFactory.login(req.body.email, req.body.password),
                        shiftDays: await waitersFactory.shiftsAndDayMatcher(),
                        workDaysInfo: await loginsFactory.waiterInfoForManager()
                    });
                }
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

    async function getReset(req, res, next) {
        try {
            await loginsFactory.reset()
            res.render("staff/manager", {
                shiftDays: await waitersFactory.shiftsAndDayMatcher(),
                workDaysInfo: await loginsFactory.waiterInfoForManager(),
                dayCounts: await waitersFactory.weekdaysWorking_OnWaiterTableCounter()
            });
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
        getReset,
        getLogout
    }
}