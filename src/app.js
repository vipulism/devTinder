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
      await user.save();
      res.send("user add");
  } catch (error) {
    res.status(400).send(`${error.message}: err in user signup`);
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


