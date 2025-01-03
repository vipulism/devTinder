const express = require("express");
const {userAuth} = require('../middleware/auth');
const {validateProfileUpdae, validatePswdUpdate} = require('../utility/validations');
const bcrypt = require("bcrypt");

const router = express.Router();


router.get('/profile/view', userAuth, async (req, res) => {
  
    try {
      const user = req.user;
      res.send(user);
    } catch (error) {
      res.status(400).send(`${error.message}: err in getting user profile`);
    }
  });

  router.patch('/profile/edit', userAuth, async (req, res) => {
      
      try {
          
        validateProfileUpdae(req);
        const loggedInUser = req.user;

        Object.keys(req.body).forEach(key => {
            loggedInUser[key] = req.body[key];
        });

        await loggedInUser.save();
        
      
        res.json({
            message:`${loggedInUser.firstName} profile is updated`,
            data:loggedInUser
        });

    } catch (error) {
      res.status(400).send(`${error.message}`);
    }
  });


  router.patch('/profile/password', userAuth, async (req, res) => {
  
    try {
    
        validatePswdUpdate(req);
        
        const newPassword = req.body.password;
        const passHashed = await bcrypt.hash(newPassword, 10);
        req.user.password = passHashed

        await req.user.save();
        res.send("user password updated");
    } catch (error) {
        res.status(400).send(`Error: ${error.message}`);
    }
   
});

  module.exports = router;