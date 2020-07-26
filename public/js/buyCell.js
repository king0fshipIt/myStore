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

let selectedProduct = null;
let selectedModel = null;
function handleActiveModel(index, model) {
  selectedModel = model;
  document.getElementById("payment").style.display = "block";
  const productDetailsDiv = document.getElementById("p-details");
  var models = productDetailsDiv.children[0].children;
  console.log(models);
  for (var i = 0; i < models.length; i++) {
    if (models[i].classList.contains("active")) {
      models[i].classList.remove("active");
    }
  }
  models[index].classList.add("active");
}
function handleActive(index, data) {
  selectedProduct = data;
  const productsDiv = document.getElementById("products");
  document.getElementById("payment").style.display = "none";
  var products = productsDiv.children;
  console.log(products);
  for (var i = 0; i < products.length; i++) {
    if (products[i].classList.contains("active")) {
      products[i].classList.remove("active");
    }
  }
  products[index].classList.add("active");

  var models = document.createElement("div");
  models.classList.add("models");
  data.models.map((value, index) => {
    var model = document.createElement("div");
    model.classList.add("model");
    model.addEventListener("click", () => {
      handleActiveModel(index, value);
    });
    var modelH3 = document.createElement("h3");
    var modelp1 = document.createElement("p");
    var modelh4 = document.createElement("p");
    modelH3.innerHTML = value.model;
    modelp1.innerHTML = value.warranty;
    modelh4.innerHTML = "Price: " + value.price + "$";
    model.appendChild(modelH3);
    model.appendChild(modelp1);
    model.appendChild(modelh4);
    models.appendChild(model);
  });
  p_details = document.getElementById("p-details");
  p_details.innerHTML = "";
  p_details.appendChild(models);
}
function fetchData() {
  const productsDiv = products;
  fetch("/api/get_roducts")
    .then((res) => res.json())
    .then((res) => {
      // console.log(res);
      res.data.map((value, index) => {
        var item = document.createElement("div");
        item.classList.add("item");
        item.addEventListener("click", () => {
          handleActive(index, value);
        });
        var pic = document.createElement("div");
        pic.classList.add("pic");
        var img = document.createElement("img");
        img.src = "images/img1.png";
        pic.appendChild(img);
        var item_d = document.createElement("div");
        item_d.classList.add("item-d");
        var item_dH3 = document.createElement("h3");
        var item_dp1 = document.createElement("p");
        // var item_dp2 = document.createElement("2");
        item_dH3.innerHTML = value.name;
        item_dp1.innerHTML = value.description;
        item_d.appendChild(item_dH3);
        item_d.appendChild(item_dp1);
        item.appendChild(pic);
        item.appendChild(item_d);
        productsDiv.appendChild(item);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
fetchData();

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
      <div class="item">
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
    price: selectedModel.price,
  };
  console.log(selectedModel);
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
        window.location.href = `/thanks.html`;
      } else {
        msg.innerHTML = res.message;
      }
      // // window.location.href = `/`;
    })
    .catch((err) => {
      console.log(err);

      // msgDiv.insertAdjacentHTML("beforeend", "<p>Server Error</p>");
    });
  console.log(values);
  e.preventDefault();
}

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
