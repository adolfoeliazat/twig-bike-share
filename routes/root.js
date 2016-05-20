var express     = require("express"),
    router      = express.Router();

// Root ("/") route
router.get("/", function(req, res){
    res.render("index");
});

// handles login logic
router.get("/login", function(req, res){
  res.redirect("/");
});

router.post("/login", passport.authenticate("local",
     {  successRedirect: "/admin",
        failureRedirect: "/"
     }), function(req, res) {
});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;
