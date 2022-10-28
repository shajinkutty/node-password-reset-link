const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const JWT_SECRET = "sfjhfkjl elrgjlerghkjlerhgkjerhg ehrglj heljgherlkj";

let user = {
  id: "lakdjfvbnkj2424t2",
  email: "jhondoe@gmail.com",
  password: "asjdnvkjasndva;'wprihjgieprhjg324909",
};

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/forgot-password", (req, res) => {
  res.render("forgot-password", {
    inputEmail: "jhondoe@gmail.com",
  });
});
app.get("/reset-password", (req, res) => {
  res.render("reset-password");
});

app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  //   check user exist in database
  if (email !== user.email) {
    res.render("forgot-password", {
      message: "User not found",
      inputEmail: email,
    });
    return;
  }
  //user exist and create one time link
  const secret = JWT_SECRET + user.password;
  const payload = {
    email: user.email,
    id: user.id,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "15m" });
  const link = `http://localhost:5000/reset-password/${user.id}/${token}`;
  res.render("reset-link", { link });
});

app.get("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;

  // check the id exist in the database
  if (id !== user.id) {
    res.send("Invalid ID");
    return;
  }
  const secret = JWT_SECRET + user.password;
  try {
    const paylod = jwt.verify(token, secret);
    res.render("reset-password", { email: user.email });
  } catch (error) {
    res.send(error.message);
  }
});

app.post("/reset-password/:id/:token", (req, res) => {
  const { password, password2 } = req.body;
  try {
    // can simply find the user with the payload email and id  and finally update with new password
    if (password !== password2) {
      throw new Error("password not matching");
    }
    // alwasy hash the password before saving
    user.password = password;
    res.send("Your password has been changed");
  } catch (error) {
    res.send(error.message);
  }
});

app.listen(5000, () => {
  console.log("server running");
});
