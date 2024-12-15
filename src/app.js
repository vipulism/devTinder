const express = require('express');
const app = express();
const {userAuth} = require('./middleware/auth');
const {connectDb} = require("./config/database");

const User = require('./models/user')

app.use(express.json());

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

  const user = new User(req.body)

  try {

    const isUser = await User.findOne({emailId:user.emailId});
    if(isUser){
      res.status(400).send("User Already Exist");
    }else{
      await user.save();
      res.send("user add");
    }
  } catch (error) {
    res.status(400).send("err in user signup ");
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
    res.status(400).send("err in getting user");
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
    res.status(400).send("err in getting feed");
  }
});


app.delete('/user', async (req, res) => {
  const {userId} = req.body;

  try {
      await User.findByIdAndDelete(userId);
      res.send('user deleted');
  } catch (error) {
    res.status(400).send("err in deleting user");
  }
});


app.patch('/user', async (req, res) => {

  const { userId, ...user} = req.body;



  try {

    await User.findOneAndUpdate({emailId:user.emailId}, user)

    // await User.findByIdAndUpdate(userId, user);
    res.send("user updated");

  } catch (error) {
    res.status(400).send("err in user signup ");
  }
     
});


