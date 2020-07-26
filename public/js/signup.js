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
  msg.innerHTML = "";
  const values = {
    fname: e.target.fname.value,
    lname: e.target.lname.value,
    email: e.target.email.value,
    password: e.target.password.value,
    rep_pass: e.target.rep_pass.value,
    code: e.target.promo_code.value,
  };
  if (values.password !== values.rep_pass) {
    msgDiv.insertAdjacentHTML("beforeend", "<p>Password Does not match</p>");
  }else if (!(/[0-9]/.test(values.password) && /[a-z]/.test(values.password) && /[A-Z]/.test(values.password) && values.password.length > 7)) {
    msgDiv.insertAdjacentHTML("beforeend", "<p>Passwords must contain at least 8 characters, including uppercase, lowercase letters and numbers.</p>");
  }else if(!captcha){
    msgDiv.insertAdjacentHTML("beforeend", "<p>Please verify reCaptcha first</p>");
  }
  else {
    msgDiv.insertAdjacentHTML("beforeend", "<p>Please wait...</p>");
    const options = {
      body: JSON.stringify(values),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    console.log(options);
    // const url=`${window.location.protocol}://${window.location.host}/users/signup`
    const url=`/users/signup`
    console.log(window.location.host);
    fetch(url, options)
      .then((res) => res.json())
      .then((res) => {
        msg.innerHTML = "";

        if (res.success) {
          msgDiv.insertAdjacentHTML("beforeend", "<p>A link is sent to you email address for account activation</p>");
        }else{
          msgDiv.insertAdjacentHTML("beforeend", `<p>${res.message}</p>`);
          
        }
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        // msgDiv.insertAdjacentHTML("beforeend", "<p>Server Error</p>");
      });
  }
  console.log(values);
  e.preventDefault();
}

function authenticate(){
  fetch('/users/authenticate')
  .then(res=>res.json())
  .then(res=>{
    console.log(res);
    if(res.authenticated){
      window.location.href="/dashboard.html"
    }
  })
  .catch(err=>{
    console.log(err);
  })
}
authenticate();