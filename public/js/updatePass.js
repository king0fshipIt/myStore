function handleSubmit(e) {
  var msgDiv = msg;
  msg.innerHTML = "";
  console.log(window.location.pathname);
  path=window.location.pathname.toString();
  const lastIndex= path.lastIndexOf('/');
  token=lastIndex!==-1? path.slice(lastIndex+1):"";
  const values = {
    password: e.target.password.value,
    rep_pass: e.target.rep_pass.value,
    token
  };
  if (values.password !== values.rep_pass) {
    msgDiv.insertAdjacentHTML("beforeend", "<p>Password Does not match</p>");
  }else if (!(/[0-9]/.test(values.password) && /[a-z]/.test(values.password) && /[A-Z]/.test(values.password) && values.password.length > 7)) {
    msgDiv.insertAdjacentHTML("beforeend", "<p>Passwords must contain at least 8 characters, including uppercase, lowercase letters and numbers.</p>");
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
    const url=`/users/update_password`
    console.log(window.location.host);
    fetch(url, options)
      .then((res) => res.json())
      .then((res) => {
        msg.innerHTML = "";

        if (res.success) {
          msgDiv.insertAdjacentHTML("beforeend", "<p>Password updated successfully now you can <a href='/' style='color:blue; cursor:pointer;'>Login</a></p>");
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
