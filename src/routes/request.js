const express = require("express"); 
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connection-request");
const User = require("../models/user");
const router = express.Router();
const {checkAllowedList} = require("../utility/validations")

router.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {

    try {   

        checkAllowedList([req.params.status], ['interested', 'ignored']);

        const oldReq = await ConnectionRequest.findOne({
            $or: [
                {fromUserId:req.user._id, toUserId:req.params.toUserId},
                {fromUserId:req.params.toUserId, toUserId:req.user._id}
            ]
        });

        console.log("oldReq", oldReq);
        
        if(oldReq){
            throw new Error('A Request already sent');
        }

        const newConnReq = new ConnectionRequest({
            fromUserId:req.user._id,
            toUserId:req.params.toUserId,
            status:req.params.status
        });

        const toUser = await User.findById({_id:req.params.toUserId});
        const data = await newConnReq.save();

        res.json({
            message:`request sent to ${toUser.firstName}`,
            data
        });
        
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/request/review/:status/:requestId', userAuth, async (req, res) => {

    try {

        const allowedStatus = ['accepted', 'rejected'];
        const {status, requestId } = req.params;
        const newStatus_isValid = allowedStatus.includes(status);
        
        checkAllowedList([status], allowedStatus);

        
        const connectionReq = await ConnectionRequest.findOne({_id:requestId, toUserId:req.user._id });
        
        if( newStatus_isValid && connectionReq && connectionReq.status === 'interested'){


            const requester = connectionReq.fromUserId;
            const approver = connectionReq.toUserId;



                connectionReq.status = status;
                const data = await connectionReq.save();
    
                res.json({
                    message:`request ${status} successfully`,
                    data
                });
            
           
        } else{

            throw new Error("Invelid review connection request");
        }
        
        

    } catch (error) {
        res.status(400).send(error.message);
    }

});

module.exports = router;