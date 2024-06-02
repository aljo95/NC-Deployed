const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });


const connectDB = async() => {
    mongoose.connect(process.env.MONGODB_CONNECT)
    .then(() => {
        console.log("Connected to DB")
    })
    .catch((err) => console.error("DB ERROR: ", err));
};

module.exports = connectDB;