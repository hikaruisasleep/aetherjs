const Discord = require('discord.js');
const mongo = require('../mongo');
const schema = require('../schemas/resin-schema');

module.exports = {
    commands: ['resin', 'resincount'],
    minArgs: 0,
    maxArgs: 1,
    callback: async (client, message, args, text) => {
        const { author } = message;
        const { id } = author;

        function sendEmbed(requestType, resinAmount) {
            let title = '';

            if (requestType === 'read') {
                title = `${author.username}'s resin count`;
            } else if (requestType === 'write') {
                title = 'Updated resin count!';
            }

            const resinEmoji = client.emojis.cache.find(
                (emoji) => emoji.name === 'Aether_fragileresin'
            );

            const embed = new Discord.MessageEmbed()
                .setTitle(title)
                .setDescription(`${resinEmoji} ${resinAmount}`);

            message.channel.send(embed);
        }

        args = +args;

        if (!args) {
            await mongo().then(async (mongoose) => {
                try {
                    const resin = await schema.findById(id);
                    sendEmbed('read', resin.resinCount);
                } finally {
                    mongoose.connection.close();
                }
            });
        } else {
            await mongo().then(async (mongoose) => {
                try {
                    await schema.findByIdAndUpdate(
                        id,
                        {
                            resinCount: args,
                        },
                        {
                            upsert: true,
                        }
                    );
                    sendEmbed('write', args);
                } finally {
                    mongoose.connection.close();
                }
            });
        }
    },
};
