const express = require('express');
const app = express();
const {userAuth} = require('./middleware/auth');
const {connectDb} = require("./config/database");

connectDb().then(() => {

    console.log("db connected...");
    app.listen(7080, () => {
        console.log("Server is sucsssfully listening on port 7080")
    });
})