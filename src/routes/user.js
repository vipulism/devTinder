const express = require("express"); 
const {userAuth} = require('../middleware/auth');
const router = express.Router();
const ConnectionRequest = require('../models/connection-request');
const User = require('../models/user');

const safeData =  ['emailId', 'firstName', 'lastName', 'skills']

router.get('/user/requests/received', userAuth, async (req, res) => {

    try {
        
        let data = await ConnectionRequest.find({status:'interested', toUserId:req.user._id})
            .select("fromUserId")
            .populate('fromUserId', safeData)

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


router.get('/feed', userAuth, async (req, res) => {

    try {

        const {_id:userId } = req.user;

        const limit = parseInt(req.query.limit) || 10;
        const skip = ((parseInt(req.query.page) || 1) - 1) * limit;

        

        let connectedUsers = await ConnectionRequest.find({
            $or:[ { toUserId:userId}, { fromUserId:userId}]
        }).select("fromUserId toUserId"); 
        
        const hideUsers = new Set();
        
        connectedUsers.forEach(itm => {
            hideUsers.add(itm.fromUserId.toString());
            hideUsers.add(itm.toUserId.toString());
        })
        
        
        const data = await User.find({
            $and:[
                {_id:{$ne: userId}},
                {_id:{ $nin: Array.from(hideUsers) }}
            ]
        }).select(safeData).skip(skip).limit(limit > 50 ? 50 : limit);

        

        res.json({
            page:parseInt(req.query.page) || 1,
            limit,
            data
        });
    } catch (error) {
        res.status(400).send(`Error: ${error.message}`);
    }
});

module.exports = router;