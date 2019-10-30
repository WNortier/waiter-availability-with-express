module.exports = function LoginsRoutes(waitersFactory, loginsFactory) {

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
            let emailInput = req.body.anInput
            //let idFetcher = await loginsFactory.idForShifts(emailInput)

            if (emailInput == "z" || emailInput == "x" || emailInput == "c" || emailInput == "v") {
                res.render("staff/waiters", {
                    accountInfo: await loginsFactory.login(emailInput),
                    //workDays: await waitersFactory.workingDaysDisplayer(idFetcher)
                });
            } else if (emailInput = "d") {
                res.render("staff/manager", {
                    accountInfo: await loginsFactory.login(emailInput),
                    shiftDays: await waitersFactory.shiftsAndDayMatcher(),
                    workDaysInfo: await loginsFactory.waiterInfoForManager()                    
                });
            }
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
            await loginsFactory.createAccount({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            });
            req.flash('info', errorMessage)
            res.redirect("displayCreateAccount")
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
                dayCounts: await waitersFactory.dayCounter()
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