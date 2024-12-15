const express = require('express');
const app = express();
const {userAuth} = require('./middleware/auth');
const {connectDb} = require("./config/database");

const User = require('./models/user')

connectDb()
.then(() => {

    console.log("db connected...");
    app.listen(7080, () => {
        console.log("Server is sucsssfully listening on port 7080")
    });
}).catch((err) => {
    console.log("Server cannot connect");
    
})


app.post('/signup', async (req, res) => {

    const user = new User({
        firstName:"Vipul",
        lastName:"Sharma",
        emailId:"vipul0809@gmail.com",
        password:"vipul@132"
    })

  try {
    await user.save();
    res.send("user add");
  } catch (error) {
    res.status(400).send("err in user signup ");
  }

     
});

