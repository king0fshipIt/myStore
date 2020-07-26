function handleSubmit(e) {
  var msgDiv = msg;
  msg.innerHTML = "";
  const values = {
    email: e.target.email.value,
  };

  msgDiv.insertAdjacentHTML("beforeend", "<p>Please wait...</p>");
  const url = `/users/forget_password?email=${values.email}`;
  console.log(window.location.host);
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      msg.innerHTML = "";

      if (res.success) {
        msgDiv.insertAdjacentHTML(
          "beforeend",
          "<p>A link is sent to you email address to reset password</p>"
        );
      } else {
        msgDiv.insertAdjacentHTML("beforeend", `<p>${res.message}</p>`);
      }
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(values);
  e.preventDefault();
}
