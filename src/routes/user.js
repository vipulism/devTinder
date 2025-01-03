const express = require("express"); 
const {userAuth} = require('../middleware/auth');
const router = express.Router();
const ConnectionRequest = require('../models/connection-request');

const safeData =  ['emailId', 'firstName', 'lastName', 'skills']

router.get('/user/requests/received', userAuth, async (req, res) => {

    try {
        
        const data = await ConnectionRequest.find({status:'interested', toUserId:req.user._id})
            .populate('fromUserId', safeData)
            .populate('toUserId', safeData);

        res.json({ data });
        
    } catch (error) {
        res.status(400).send(`Error:${error.message}`);
    }

});

router.get('/user/connections', userAuth, async (req, res) => {

    try {

        const {_id:userId} = req.user;
        
        let data = await ConnectionRequest.find({
            $or:[
                {status:'accepted', toUserId:userId},
                {status:'accepted', fromUserId:userId},
            ]
        }).populate('fromUserId', safeData).populate('toUserId', safeData)
        
       data = data.map(cnRq => cnRq.fromUserId._id.toString() === userId.toString() ? cnRq.toUserId : cnRq.fromUserId);
 

        res.json({ data });
        
    } catch (error) {
        res.status(400).send(`Error: ${error.message}`);
    }

});

module.exports = router;