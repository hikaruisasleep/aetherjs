const mongo = require('./mongo');
const schema = require('./schemas/resin-schema');

module.exports = (client) => {
    client.on('message', async (message) => {
        const { author } = message;
        const { id } = author;

        await mongo().then(async (mongoose) => {
            try {
                await schema
                    .findOneAndUpdate(
                        {
                            _id: id,
                        },
                        {
                            $inc: {
                                resinCount: -1,
                            },
                        },
                        {
                            upsert: true,
                        }
                    )
                    .exec();
            } finally {
                mongoose.connection.close();
            }
        });
    });
};
