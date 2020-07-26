var captcha=false;
function captchaSuccess(token){
  captcha=true;
}
function captchaError(token){
  captcha=false;
}
function captchaExpired(token){
  captcha=false;
}
function handleSubmit(e) {
  var msgDiv = msg;
  msgDiv.innerHTML = "";
  if(captcha){
  const values = {
    username: e.target.email.value,
    password: e.target.password.value,
  };

  msgDiv.insertAdjacentHTML("beforeend", "<p>Please wait...</p>");
  const options = {
    body: JSON.stringify(values),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const url = `/users/login`;
  console.log(window.location.host);
  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      msgDiv.innerHTML = "";
      console.log(data);
      window.location.href = `/dashboard.html`;
    })
    .catch((err) => {
      console.log(err);
      msgDiv.innerHTML = "";
      msgDiv.insertAdjacentHTML(
        "beforeend",
        "<p>Email or password is incorrect</p>"
      );
    });

  console.log(values);
  }else{
    msgDiv.insertAdjacentHTML("beforeend", "<p>Please verify reCaptcha first</p>");
  }
  e.preventDefault();
}

function authenticate() {
  fetch("/users/authenticate")
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if (res.authenticated) {
        window.location.href = "/dashboard.html";
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
authenticate();
