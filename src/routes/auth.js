const express = require("express");
const router = express.Router();
const {validateSignup, validateLogin} = require("../utility/validations");
const bcrypt = require("bcrypt");
const User = require("../models/user")


    router.post('/signup', async (req, res) => {
  
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


    router.post('/login', async (req, res) => {

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

    router.get('/logout', async (req, res) => {
  
        try {
          res.clearCookie('token');
          res.send('user logged out');
          
        } catch (error) {
          res.status(400).send(`${error.message}: err in getting user`);
        }
      });


module.exports = router