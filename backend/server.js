var express = require("express");
var mysql = require("mysql");
var session = require("express-session");
var cors = require("cors");
var crypto = require("crypto");

const date = require("date-and-time");

const app = express();
app.use(express.json());
app.use(session({ secret: "ssshhhhh", saveUninitialized: true, resave: true }));
app.use(cors());
var sess;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ihx_wallet",
});

app.get("/getUsers", function (req, res) {
  let sql = "SELECT * FROM users";
  con.query(sql, function (err, result) {
    if (err) throw err;
    // let response = [];
    // result.map((res) => response.push(res.name));

    res.send(result);
  });
});

app.get("/checkAlive", function (req, res) {
  if (sess) {
    let responseJSON = {
      response: "LoggedIn",
      user: sess.name,
    };
    res.send(responseJSON);
  } else {
    responseJSON = {
      response: "LoggedOut",
    };
    res.send(responseJSON);
  }
});

app.post("/register", function (req, res) {
  console.log(req.body);
  let name = req.body.name;
  let mobile = req.body.mobile;
  let password = req.body.password;

  let md5 = crypto.createHash("md5");
  let finalPass = md5.update(password).digest("hex");
  console.log(finalPass);
  let sql = `INSERT INTO users(name,mobile,password) VALUES('${name}','${mobile}','${finalPass}')`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    let responseJSON = {
      response: "Inserted",
    };
    res.send(responseJSON);
  });
});

app.post("/login", function (req, res) {
  let name = req.body.name;
  let password = req.body.password;

  let md5 = crypto.createHash("md5");
  let finalPass = md5.update(password).digest("hex");

  console.log("Login => " + name, finalPass);

  let sql = `SELECT * FROM users WHERE name='${name}' AND password='${finalPass}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;

    if (result.length > 0) {
      sess = req.session;
      sess.userid = result[0].id;
      sess.name = result[0].name;
      sess.mobile = result[0].mobile;
      console.log(sess);
      let responseJSON = {
        response: "Verified",
      };
      res.send(responseJSON);
    } else {
      responseJSON = {
        response: "Not Verified",
      };
      res.send(responseJSON);
    }
  });
});

app.post("/addMoney", function (req, res) {
  console.log(sess);
  let amount = req.body.amount;
  let comment = req.body.comment;
  let now = new Date();
  let value = date.format(now, "YYYY/MM/DD HH:mm:ss");
  if (sess != null) {
    let sql = `SELECT * FROM users WHERE id='${sess.userid}'`;
    con.query(sql, function (err, result) {
      if (err) throw err;

      finalAmt = parseInt(result[0].balance) + parseInt(amount);

      if (finalAmt > parseInt(result[0].balance)) {
        sql = `UPDATE users SET balance='${finalAmt}' WHERE id='${sess.userid}'`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Add Money SQL => " + sess.name);
          sql = `INSERT INTO transactions(from_user,to_user,amount,DateTime,comment) VALUES('${sess.name}','${sess.name}','${amount}','${value}','${comment}')`;
          con.query(sql);
          let responseJSON = {
            response: "Amount Credited to Wallet",
          };
          res.send(responseJSON);
        });
      } else {
        responseJSON = {
          response: "Please enter amount greater than 0",
        };
        res.send(responseJSON);
      }
    });
  } else {
    let responseJSON = {
      response: "Please login again!",
    };
    res.send(responseJSON);
  }
});

app.post("/transferMoney", function (req, res) {
  let from = sess.userid;
  let to = req.body.to;
  let amount = req.body.amount;
  let comment = req.body.comment;
  let now = new Date();
  let value = date.format(now, "YYYY/MM/DD HH:mm:ss");

  if (sess != null) {
    let sql = `SELECT * FROM users WHERE id='${from}'`;
    con.query(sql, function (err, result) {
      if (err) throw err;

      if (amount > 0) {
        if (result[0].balance >= amount) {
          let from_bal = result[0].balance - amount;
          sql = `UPDATE users SET balance='${from_bal}' WHERE id='${from}'`;
          con.query(sql, function (err, result) {
            sql = `SELECT * FROM users WHERE name='${to}'`;
            con.query(sql, function (err, result) {
              if (err) throw err;

              let to_id = result[0].id;
              let to_bal = parseInt(result[0].balance) + parseInt(amount);
              sql = `UPDATE users SET balance='${to_bal}' WHERE name='${to}'`;
              con.query(sql, function (err, result) {
                if (err) throw err;

                sql = `INSERT INTO transactions(from_user,to_user,amount,DateTime,comment) VALUES('${sess.name}','${to}','${amount}','${value}','${comment}')`;
                con.query(sql, function (err, result) {
                  let responseJSON = {
                    response: "Transferred!",
                  };
                  res.send(responseJSON);
                });
              });
            });
          });
        } else {
          responseJSON = {
            response: "Insufficient Balance!",
          };
          res.send(responseJSON);
        }
      } else {
        responseJSON = {
          response: "Please enter amount greater than 0",
        };
        res.send(responseJSON);
      }
    });
  }
});

app.get("/transactions", function (req, res) {
  let sql = `SELECT * FROM transactions WHERE from_user='${sess.name}' OR to_user='${sess.name}'`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/logout", function (req, res) {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).send("Unable to log out");
      } else {
        sess = null;
        console.log("out");
        let responseJSON = {
          response: "LoggedOut",
        };
        res.send(responseJSON);
      }
    });
  } else {
    res.end();
  }
});

app.listen(5000, () => console.log("Server Started"));
