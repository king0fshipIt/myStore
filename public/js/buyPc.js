var userData = null;
function authenticate() {
  fetch("/users/authenticate")
    .then((res) => res.json())
    .then((res) => {
      // console.log(res);
      if (!res.authenticated) {
        window.location.href = "/index.html";
      } else {
        userData = res.user;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
authenticate();

function fetchPurchases() {
  fetch("/records/get_data")
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      var purchases = document.getElementById("purchases");
      res.data.map((value, index) => {
        purchases.insertAdjacentHTML(
          "beforeend",
          `<li class="single-purchase">
      <div class="item">
          <div class="pic">
              <img src="images/img1.png" alt="...">
          </div>
          <div class="item-d">
              <h3>${value.product}</h3>
              <p>${value.quantity} Units</p>
          </div>
      </div>
  </li>`
        );
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
fetchPurchases();

// dropdown
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}
function sidebar_open() {
  document.getElementById("mySidebar").style.display = "block";
}
function sidebar_close() {
  document.getElementById("mySidebar").style.display = "none";
}
