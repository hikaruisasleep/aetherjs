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

        if (text === 'zero') {
            await mongo().then(async (mongoose) => {
                try {
                    await schema.findByIdAndUpdate(
                        id,
                        {
                            resinCount: 0,
                        },
                        {
                            upsert: true,
                        }
                    );
                    sendEmbed('write', args);
                } catch (e) {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('rusak')
                        .setDescription('❌ kw habis ngapain pantek');

                    message.channel.send(embed);
                } finally {
                    mongoose.connection.close();
                }
            });
            return;
        }

        args = +args;

        if (!args) {
            await mongo().then(async (mongoose) => {
                try {
                    const resin = await schema.findById(id);
                    if (resin === null) throw 'empty';
                    sendEmbed('read', resin.resinCount);
                } catch (e) {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('rusak')
                        .setDescription('❌ kw habis ngapain pantek');

                    message.channel.send(embed);
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
                    const embed = new Discord.MessageEmbed()
                        .setTitle('rusak')
                        .setDescription('❌ kw habis ngapain pantek');

                    message.channel.send(embed);
                } finally {
                    mongoose.connection.close();
                }
            });
        }
    },
};
