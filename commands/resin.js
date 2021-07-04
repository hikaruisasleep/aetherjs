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

        function sendEmbed(requestType, resinAmount, emote) {
            let title = '';

            if (requestType === 'read') {
                title = `${author.username}'s resin count`;
            } else if (requestType === 'write') {
                title = 'Updated resin count!';
            } else if (requestType === 'err') {
                title = 'rusak';
            }

            // eslint-disable-next-line no-shadow
            const emoji = client.emojis.cache.find((emoji) => emoji.name == emote);

            const embed = new Discord.MessageEmbed()
                .setTitle(title)
                .setDescription(`${emoji} ${resinAmount}`);

            message.channel.send(embed);
        }

        args = +args;

        if (!args) {
            await mongo().then(async (mongoose) => {
                try {
                    const resin = await schema.findById(id);
                    if (resin === null) throw 'empty';
                    sendEmbed('read', resin.resinCount, 'Aether_fragileresin');
                } catch (e) {
                    sendEmbed('err', 'kw habis ngapain pantek', 'x');
                } finally {
                    mongoose.connection.close();
                }
            });
        } else {
            await mongo().then(async (mongoose) => {
                try {
                    if (isNaN(args)) throw 'NaN';
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
                } catch (e) {
                    sendEmbed('err', 'kw habis ngapain pantek', 'x');
                } finally {
                    mongoose.connection.close();
                }
            });
        }
    },
};
