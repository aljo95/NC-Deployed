
// pages.js 
const express = require("express"); 
const router = express.Router(); 

/*
router.get('/checkAuth', (req, res) => {

    console.log("MMMMMMMMMMMMMMMMMMMMMMMMMM");
    req.session.destroy();
    
    console.log(req.session);

    const auth = req.session.name !== 'undefined';
    console.log("MMMMMMMMMMMMMMMMMMMMMMMMMM");
    res.status(200).json({ auth });
})
 */ 
router.get("/", (req, res) => { 
    if (req.session.name) { 
        var name = req.session.name; 
        res.render("home", { name: name }); 
    } 
    return res.render("home", { name: null }); 
}); 
router.get("/login", (req, res) => { 
    if (req.session.name) { 
        res.redirect("/"); 
    } 
    return res.render("login", { error: null }); 
}); 
router.get("/register", (req, res) => { 
    if (req.session.name) { 
        res.redirect("/"); 
    } 
    return res.render("register", { error: null }); 
}); 














function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.send("SENT FROM ENSURE HEHEH"); //instead redirect "/"
};

module.exports = router; 
