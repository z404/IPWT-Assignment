$(document).ready(function () {
  var form = $("#viewloanform");
  form.submit(function (event) {
    event.preventDefault();
    var custID = $("#custid").val();
    var loanID = $("#loanid").val();
    console.log("custID: " + custID);
    console.log("loanID: " + loanID);
    if (custID == "" || loanID == "") {
      alert("All fields are required");
      return;
    } else {
      // make ajax request to server
      $.ajax({
        url: "http://localhost:3000/ViewLoanById",
        type: "POST",
        data: form.serialize(),
        success: function (response) {
          console.log(response);
          sessionStorage.setItem("myData", JSON.stringify(response));
          window.location.href = "modifyloandetails.html";
        },
        error: function (error) {
          if (error.status == 404) {
            alert("No loan found for the given customer ID and loan ID");
          } else if (error.status == 500) {
            alert("Internal server error");
          }
        },
      });
    }
  });
});
