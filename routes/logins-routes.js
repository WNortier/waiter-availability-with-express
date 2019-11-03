module.exports = function LoginsRoutes(waitersFactory, loginsFactory) {

    async function home(req, res, next) {
        console.log(req.session)
        try {
            res.render("home", {});
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

    async function returnHome(req, res, next) {
        try {
            res.redirect("/");
        } catch (err) {
            next(err);
        }
    }

    async function getLogin(req, res, next) {
        try {

            //let idFetcher = await loginsFactory.idForWorkingDaysDisplayerToExecute(req.body.email)

            //if (emailInput == "z" || emailInput == "x" || emailInput == "c" || emailInput == "v") {



            //console.log(loginResult)
            if (req.body.email == "" || req.body.password == "") {
                req.flash('info', "Please complete all login fields!")
                res.redirect('/')
            } else if (req.body.email !== "admin@gmail.com" && req.body.email !== "" && req.body.password !== "") {
                let loginResult = await loginsFactory.login(req.body.email, req.body.password)
                if (loginResult == false) {
                    req.flash('info', errorMessage)
                    res.redirect('/')
                } else if (loginResult !== false)
                    res.render("staff/waiters", {
                        accountInfo: await loginsFactory.login(req.body.email, req.body.password)
                    });
            } else if (req.body.email == "admin@gmail.com" && req.body.email !== "" && req.body.password !== "") {
                res.render("staff/manager", {
                    accountInfo: await loginsFactory.login(req.body.email, req.body.password),
                    //workDays: await waitersFactory.workingDaysDisplayer(idFetcher)
                    shiftDays: await waitersFactory.shiftsAndDayMatcher(),
                    workDaysInfo: await loginsFactory.waiterInfoForManager()
                });
            }






            //} else if (emailInput = "d") {
            // res.render("staff/manager", {
            //     accountInfo: await loginsFactory.login(emailInput),
            //     shiftDays: await waitersFactory.shiftsAndDayMatcher(),
            //     workDaysInfo: await loginsFactory.waiterInfoForManager()
            // });
            // }
        } catch (err) {
            next(err);
        }


        //EASYENTRY

        // if (emailInput == ""){
        //     res.render("staff/waiters")
        // } else if (emailInput = "a"){
        //     res.render("staff/manager")
        // }

        //let theHash = await loginsFactory.passwordHasher(inputOne)
        // console.log({theHash})
        //let extractedHash = String(theHash);
        //let compareResult = await loginsFactory.passwordComparer(inputOne, extractedHash)   
        // console.log(compareResult)


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
                } else if (successBoolean == true){
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
        getReset
    }
}