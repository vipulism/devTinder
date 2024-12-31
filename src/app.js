const express = require('express');
const app = express();
const {connectDb} = require("./config/database");
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);

connectDb()
.then(() => {

    console.log("db connected...");
    app.listen(7080, () => {
        console.log("Server is sucsssfully listening on port 7080")
    });
}).catch((err) => {
    console.log("Server cannot connect");
    
});







