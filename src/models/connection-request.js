const mongoose = require('mongoose');

const ConnectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored", "interested", "accepted", "rejected"],
            message:`{VALUE} is an Invelid Status code`
        }
    }
}, {timestamps:true});

ConnectionRequestSchema.pre('save', function (next) {
    const req = this;
    if(req.toUserId.equals(req.fromUserId)){
        throw new Error('Cannot send a connection request to self')
    }
    next();
})

module.exports = mongoose.model("ConnectionRequest", ConnectionRequestSchema);