const express = require('express');
const app = express();
const {userAuth} = require('./middleware/auth');

app.listen(7080, () => {
    console.log("Server is sucsssfully listening on port 7080")
});

app.use("/user/login", (req, res) => {
    res.send("<h1>Namaste Deepa login please</h1>")
});

app.use("/user/get", userAuth, (req, res) => {
    res.send("<h1>Namaste Deepa</h1>")
});