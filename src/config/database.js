 const mongoose = require("mongoose");
//  "mongodb+srv://vipul0809:zq0G77k1FmpxFsKB@cluster0.urvqc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0?directConnection=true"

const connectDb = async () => {
    await mongoose.connect("mongodb+srv://vipul0809:zq0G77k1FmpxFsKB@cluster0.urvqc.mongodb.net/devTinder");
};

module.exports = { connectDb };