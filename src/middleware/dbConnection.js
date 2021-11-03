const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb://localhost:27017/book_db', {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then(() => {
        console.log("===DB connected successfuly....");
    }).catch(() => {
        console.log("===DB connection failed...");
    })
}
module.exports = connectDB