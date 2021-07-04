const mongoose = require('mongoose');

const resinSchema = mongoose.Schema({
    _id: { type: String, required: true },
    resinCount: { type: Number, required: true },
});

module.exports = mongoose.model('resin-counter', resinSchema);
