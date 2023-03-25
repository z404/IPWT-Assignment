const http = require("http");
var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

con.query("USE anish_db;");

// delete table if it exists
con.query("DROP TABLE IF EXISTS Loan_Table_Name;");
con.query(
  "CREATE TABLE Loan_Table_Name (Loan_ID varchar(50) PRIMARY KEY, Customer_ID varchar(50), Loan_Type varchar(50), Loan_Amount DECIMAL(12,2), EMI INT(5), Tenure INT(2), Opening_Date date, Status varchar(50));"
);
con.query(
  "INSERT INTO Loan_Table_Name VALUES ('L1112', 'CUST112', 'Home', 1000000, 10000, 12, '2016-10-12', 'Completed');"
);
con.query(
  "INSERT INTO Loan_Table_Name VALUES ('L1114', 'CUST114', 'Personal', 40000, 2000, 22, '2016-10-13', 'New');"
);
con.query(
  "INSERT INTO Loan_Table_Name VALUES ('L1115', 'CUST115', 'Home', 1000000, 10000, 12, '2016-10-18', 'Completed');"
);
con.query(
  "INSERT INTO Loan_Table_Name VALUES ('L1116', 'CUST116', 'Personal', 40000, 2000, 22, '2016-10-19', 'New');"
);
con.query(
  "INSERT INTO Loan_Table_Name VALUES ('L1117', 'CUST117', 'Home', 1000000, 10000, 12, '2016-10-20', 'Completed');"
);

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "POST" && req.url === "/ViewLoanById") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const custID = body.split("&")[0].split("=")[1];
      const loanID = body.split("&")[1].split("=")[1];

      // make a query to the database, log the result
      con.query(
        "SELECT * FROM Loan_Table_Name WHERE Loan_ID='" +
          loanID +
          "' AND Customer_ID='" +
          custID +
          "';",
        function (err, result) {
          if (err) {
            console.log(err);
            res.statusCode = 500;
            res.end();
            return;
          }
          //   check if the result is empty
          if (result == "") {
            res.statusCode = 404;
            res.end();
          } else {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify(result[0]));
          }
        }
      );
    });
  } else if (req.method === "POST" && req.url === "/ModifyLoanDetails") {
    console.log("ModifyLoanDetails");
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const custID = body.split("&")[0].split("=")[1];
      const loanID = body.split("&")[1].split("=")[1];
      const loanType = body.split("&")[2].split("=")[1];
      const loanAmount = body.split("&")[3].split("=")[1];
      const emi = body.split("&")[4].split("=")[1];
      const tenure = body.split("&")[5].split("=")[1];
      const status = body.split("&")[6].split("=")[1];

      if (status != "New") {
        res.statusCode = 400;
        res.end();
        return;
      } else {
        con.query(
          "UPDATE Loan_Table_Name SET EMI=" +
            emi +
            ", Tenure=" +
            tenure +
            " WHERE Loan_ID='" +
            loanID +
            "' AND Customer_ID='" +
            custID +
            "';",
          function (err, result) {
            if (err) {
              console.log(err);
              res.statusCode = 500;
              res.end();
              return;
            }
            res.statusCode = 200;
            res.end();
          }
        );
      }
    });
  } else {
    console.log("404");
    res.statusCode = 404;
    res.end();
  }
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
