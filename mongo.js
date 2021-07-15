const mongoose = require('mongoose');
const mongoPath = 'mongodb://127.0.0.1:27017' || process.env.MONGODB_URI;

module.exports = async () => {
    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    return mongoose;
};
