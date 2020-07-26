var userData = null;
function authenticate() {
  fetch("/users/authenticate")
    .then((res) => res.json())
    .then((res) => {
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
          `<li class="single-purchase" style="border-bottom: 1.3px solid black; color: #fff; padding-right:10px">
      <div class="item" >
          <div class="item-d" >
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

function handleSubmit(e) {
  console.log(e.target);
  values = {
    product: selectedProduct.name,
    model: selectedModel,
    quantity: e.target.quantity.value,
    card_number: e.target.card_number.value,
    name: e.target.name.value,
    expiry: `${e.target.expiry_year.value}/${e.target.expiry_month.value}`,
    cvv: e.target.cvv.value,
  };
  const options = {
    body: JSON.stringify(values),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const url = `/records/add_transaction`;
  console.log(window.location.host);
  fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if (res.success) {
        window.location.href = `/thanks-for-purchase`;
      } else {
        msg.innerHTML = res.message;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(values);
  e.preventDefault();
}

function handleDD() {
  document.getElementById("dd").classList.toggle("show");
}
function sidebar_open() {
  document.getElementById("mySidebar").style.display = "block";
}
function sidebar_close() {
  document.getElementById("mySidebar").style.display = "none";
}
