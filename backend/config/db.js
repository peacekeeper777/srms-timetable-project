const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://amanchd2005_db_user:12345@ac-xg6dcq7-shard-00-00.zh3gltx.mongodb.net:27017,ac-xg6dcq7-shard-00-01.zh3gltx.mongodb.net:27017,ac-xg6dcq7-shard-00-02.zh3gltx.mongodb.net:27017/?ssl=true&replicaSet=atlas-dftlba-shard-0&authSource=admin&appName=Cluster0');

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;