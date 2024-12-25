const express = require('express');
const app = express();
const {userAuth} = require('./middleware/auth');
const {connectDb} = require("./config/database");
const {validateSignup, validateLogin} = require("./utility/validations");
const cookieParser = require('cookie-parser')

const User = require('./models/user')

app.use(express.json());
app.use(cookieParser());

connectDb()
.then(() => {

    console.log("db connected...");
    app.listen(7080, () => {
        console.log("Server is sucsssfully listening on port 7080")
    });
}).catch((err) => {
    console.log("Server cannot connect");
    
});


app.post('/signup', async (req, res) => {
  
  try {
    
    validateSignup(req);
    
    const {password, ...userData} = req.body;
    const passHashed = await bcrypt.hash(password, 10);
    const user = new User({...userData, password:passHashed});

      await user.save();
      res.send("user add");
  } catch (error) {
    res.status(400).send(`Error: ${error.message}: err in user signup`);
  }
     
});


app.post('/login', async (req, res) => {

  
  try {
    validateLogin(req);

    const {password,emailId} = req.body;
    const user = await User.findOne({emailId});
    const passHashed = await user.verifyPassward(password);

    if(!passHashed){
      throw new Error('Wrong Password')
    }

    const token = await user.getJWT();
    res.cookie('token', token);
    res.send("user logged in successfully");

  } catch (error) {
    res.status(400).send(`Error: ${error.message}: err in user login`);
  }
     
});



app.get('/profile', userAuth, async (req, res) => {
  
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send(`${error.message}: err in getting user profile`);
  }
});

app.get('/logout', async (req, res) => {
  
  try {
    res.clearCookie('token');
    res.send('user logged out');
    
  } catch (error) {
    res.status(400).send(`${error.message}: err in getting user`);
  }
});



