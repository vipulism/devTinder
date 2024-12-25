const express = require('express');
const app = express();
const {userAuth} = require('./middleware/auth');
const {connectDb} = require("./config/database");
const {validateSignup, validateLogin} = require("./utility/validations");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

     if(!user){
      throw new Error(`user not registered`);
     }
    
     const passHashed = await bcrypt.compare(password, user.password);

     if(!passHashed){
        throw new Error('Wrong Password')
     }

     const token = jwt.sign({_id:user.id},"mogaMoga");
     
    console.log("token", token);

    res.cookie('token', token);
    res.send("user logged in successfully");

  } catch (error) {
    res.status(400).send(`Error: ${error.message}: err in user login`);
  }
     
});

app.get('/profile', async (req, res) => {
  
  try {

    const cookies = req.cookies;
    const {token} = cookies;

    const {_id} = jwt.verify(token, "mogaMoga")
    console.log('jwt id', _id);
    
    const user = await User.findOne({_id});

    if(!cookies || !cookies?.token){
      res.status(404).send("token not found");
    }

    if(user){
      res.send(user);
    } else {
      res.status(404).send("user not found");
    }
  } catch (error) {
    res.status(400).send(`${error.message}: err in getting user profile`);
  }
});



app.get('/user', async (req, res) => {
  const {emailId} = req.body;
  
  try {
    const user = await User.findOne({emailId});
    if(user){
      res.send(user);
    } else {
      res.status(404).send("user not found")
    }
  } catch (error) {
    res.status(400).send(`${error.message}: err in getting user`);
  }
});


app.get('/feed', async (req, res) => {

  try {
    const users = await User.find({});
    if(users.length){
      res.send(users);
    } else {
      res.status(404).send("user not found")
    }
  } catch (error) {
    res.status(400).send(`${error.message}:err in getting feed`);
  }
});


app.delete('/user', async (req, res) => {
  const {userId} = req.body;

  try {
      await User.findByIdAndDelete(userId);
      res.send('user deleted');
  } catch (error) {
    res.status(400).send(`${error.message}: err in deleting user`);
  }
});


app.patch('/user', async (req, res) => {

  const { userId, ...user} = req.body;

  
  try {
    const allowedKeys = ['firstName', 'lastName', 'gender', 'userId'];
    const isNotAllowed = Object.keys(req.body).filter(key => !allowedKeys.includes(key));
    if(isNotAllowed.length){
      console.log('kkkkkk', Object.keys(req.body))
      res.status(400).send(`${isNotAllowed.join(', ')} are not allowed`);
    }else{
      await User.findOneAndUpdate({emailId:user.emailId}, user);
      // await User.findByIdAndUpdate(userId, user);
      res.send("user updated");
    }

  } catch (error) {
    res.status(400).send(`${error.message}: err in user signup`);
  }
     
});


