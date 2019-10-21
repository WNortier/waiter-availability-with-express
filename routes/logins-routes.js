module.exports = function LoginsRoutes(loginsFactory) {

    async function home(req, res, next) {
        try {
            res.render("home", {
            });
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
            let inputOne = req.body.anInput
            if (inputOne == ""){
                res.render("staff/waiters")
            } else if (inputOne = "a"){
                res.render("staff/manager")
            }
            
            //let theHash = await loginsFactory.passwordHasher(inputOne)
           // console.log({theHash})
            //let extractedHash = String(theHash);
            //let compareResult = await loginsFactory.passwordComparer(inputOne, extractedHash)   
           // console.log(compareResult)

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

    async function getCreateAccount(req, res, next){
        try {
            await loginsFactory.createAccount({
				username: req.body.username,
				password: req.body.password,
				email: req.body.email
            });
            res.redirect("displayCreateAccount")
        } catch (err) {
            next(err);
        }
    }

    async function getReset(req, res, next) {
        try {
          await loginsFactory.reset()
          res.redirect('/');
        } catch (err) {
          next(err)
        }
      }

    return {
        //send,
        home,
        returnHome,
        getLogin,
        displayAbout,
        
        displayCreateAccount,
        getCreateAccount,
        getReset
    }
}