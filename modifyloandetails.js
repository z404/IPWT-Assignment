$(document).ready(function () {
  var myData = JSON.parse(sessionStorage.getItem("myData"));
  // sessionStorage.removeItem("myData");
  if (myData == null) {
    alert("Something went wrong, please try again");
    window.location.href = "viewloanbyid.html";
  }

  $("#loanid").val(myData.Loan_ID);
  $("#custid").val(myData.Customer_ID);
  $("#loantype").val(myData.Loan_Type);
  $("#loanamt").val(myData.Loan_Amount);
  $("#loanemi").val(myData.EMI);
  $("#tenure").val(myData.Tenure);
  $("#loanstatus").val(myData.Status);

  $("#viewloanform").submit(function (event) {
    event.preventDefault();
    var loanEMI = $("#loanemi").val();
    var Tenure = $("#tenure").val();

    if (loanEMI == "" || Tenure == "") {
      alert("All fields are required");
      return;
    } else if (loanEMI < 1000 || loanEMI > 10000) {
      alert("EMI should be between 1000 and 10000");
      return;
    } else {
      // make ajax request to server
      $.ajax({
        url: "http://localhost:3000/ModifyLoanDetails",
        type: "POST",
        data: $("#viewloanform").serialize(),
        success: function (response) {
          console.log(response);
          alert("Loan details modified successfully");
          window.location.href = "viewloanbyid.html";
        },
        error: function (error) {
          if (error.status == 404) {
            alert("No loan found for the given customer ID and loan ID");
          } else if (error.status == 500) {
            alert("Internal server error");
          } else if (error.status == 400) {
            alert("Loan status is not New");
          }
        },
      });
    }
  });
});
