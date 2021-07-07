const mongoose = require('mongoose');

const resinSchema = mongoose.Schema({
    _id: { type: String, required: true },
    resinCount: { type: Number, required: true },
    fragileCount: { type: Number, required: false },
    condensedCount: { type: Number, required: false },
    transientCount: { type: Number, required: false },
});

module.exports = mongoose.model('resin-counter', resinSchema);
