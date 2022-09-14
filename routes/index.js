var express = require("express");
var router = express.Router();
var pool = require("./pool");

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index");
});

// Sign-Up Module
router.get("/createaccount", function (req, res) {
  res.render("signup", { message: "", messageError: "" });
});

router.post("/signedup", function (req, res) {
  pool.query(
    "insert into adminlogin(email, password, adminname, mobile) values(?,?,?,?) ",
    [req.body.email, req.body.password, req.body.name, req.body.mobile],
    function (error, result) {
      if (error) {
        console.log("Error : ", error);
        res.render("signup", { message: "", messageError: "Server Error" });
      } else {
        console.log("Result : ", result);
        res.render("signup", {
          message: "Account Successfully Created",
          messageError: "",
        });
      }
    }
  );
});

// Sign-In Module
router.get("/login", function (req, res) {
  res.render("login", { msg: "" });
});

router.get("/dashboard", function (req, res) {
  const query =
    "select count(*) as countCategory from category;select count(*) as countProduct,sum(stock) as countStock from products;select count(*) as countBrands from brands";
  pool.query(query, function (error, result) {
    if (error) {
      console.log("Error : ", error);
      res.render("dashboard", { status: false, msg: "", result: [] });
    } else {
      console.log("Result : ", result);
      res.render("dashboard", { status: true, msg: "", result: result });
    }
  });
});

router.post("/checkadmin", function (req, res) {
  pool.query(
    "select * from adminlogin where (email = ? or mobile = ?) and password = ?",
    [req.body.email, req.body.email, req.body.password],
    function (error, result) {
      if (error) {
        console.log("Error : ", error);
        res.render("login", { msg: "Server Error" });
      } else {
        if (result.length == 1) {
          console.log("Result : ", result);
          res.redirect("/dashboard");
        } else {
          res.render("login", { msg: "Invalid Email Id or Password" });
        }
      }
    }
  );
});

module.exports = router;
