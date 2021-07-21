const Discord = require('discord.js');
const mongo = require('../mongo');
const schema = require('../schemas/resin-schema');

module.exports = {
    commands: ['resin', 'resincount'],
    minArgs: 0,
    maxArgs: 2,
    callback: async (client, message, args, text) => {
        const { author, member } = message;
        const { id } = author;

        function sendError(e) {
            const embed = new Discord.MessageEmbed()
                .setTitle('rusak')
                .setDescription('❌ kw habis ngapain pantek')
                .setFooter(e);

            message.channel.send(embed);
        }

        function sendEmbed(
            requestType,
            resinAmount,
            fragileAmount,
            condensedAmount,
            transientAmount
        ) {
            let title = '';

            let fragile = true;
            let condensed = true;
            let transient = true;

            if (requestType === 'read') {
                title = `${author.username}'s resin count`;
            } else if (requestType === 'write') {
                title = 'Updated resin count!';
            }

            const resinEmoji = client.emojis.cache.find((emoji) => emoji.name === 'Aether_resin');
            const condensedEmoji = client.emojis.cache.find(
                (emoji) => emoji.name === 'Aether_condensedresin'
            );
            const transientEmoji = client.emojis.cache.find(
                (emoji) => emoji.name === 'Aether_transientresin'
            );

            const embed = new Discord.MessageEmbed()
                .setTitle(title)
                .addField(resinEmoji, resinAmount, false);
            if (fragile) {
                embed.addField(resinEmoji, fragileAmount, true);
            }
            if (condensed) {
                embed.addField(condensedEmoji, condensedAmount, true);
            }
            if (transient) {
                embed.addField(transientEmoji, transientAmount, true);
            }

            message.channel.send(embed);
        }

        if (!args[0]) {
            await mongo().then(async (mongoose) => {
                try {
                    const resin = await schema.findById(id);
                    if (!resin.resinCount) {
                        await schema.findByIdAndUpdate(
                            id,
                            {
                                resinCount: 0,
                            },
                            {
                                upsert: true,
                            }
                        );
                    }
                    if (!resin.fragileCount) {
                        await schema.findByIdAndUpdate(
                            id,
                            {
                                fragileCount: 0,
                            },
                            {
                                upsert: true,
                            }
                        );
                    }
                    if (!resin.condensedCount) {
                        await schema.findByIdAndUpdate(
                            id,
                            {
                                condensedCount: 0,
                            },
                            {
                                upsert: true,
                            }
                        );
                    }
                    if (!resin.transientCount) {
                        await schema.findByIdAndUpdate(
                            id,
                            {
                                transientCount: 0,
                            },
                            {
                                upsert: true,
                            }
                        );
                    }
                    sendEmbed(
                        'read',
                        resin.resinCount,
                        resin.fragileCount,
                        resin.condensedCount,
                        resin.transientCount
                    );
                } catch (e) {
                    sendError(e);
                } finally {
                    mongoose.connection.close();
                }
            });
            return;
        } else if (!isNaN(args[0])) {
            await mongo().then(async (mongoose) => {
                try {
                    await schema.findByIdAndUpdate(
                        id,
                        {
                            resinCount: +args[0],
                        },
                        {
                            upsert: true,
                        }
                    );
                    const resin = await schema.findById(id);
                    sendEmbed(
                        'write',
                        resin.resinCount,
                        resin.fragileCount,
                        resin.condensedCount,
                        resin.transientCount
                    );
                } catch (e) {
                    sendError(e);
                } finally {
                    mongoose.connection.close();
                }
            });
            return;
        } else if (args[0] === '0') {
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
                    const resin = await schema.findById(id);
                    sendEmbed(
                        'write',
                        resin.resinCount,
                        resin.fragileCount,
                        resin.condensedCount,
                        resin.transientCount
                    );
                } catch (e) {
                    sendError(e);
                } finally {
                    mongoose.connection.close();
                }
            });
            return;
        } else if (args[0] === 'condensed') {
            await mongo().then(async (mongoose) => {
                try {
                    if (isNaN(args[1])) {
                        throw `TypeError: cannot insert "args[1]" (type: ${typeof args[1]}) into field Number: isNaN`;
                    }
                    if (args[1] > 5) {
                        throw 'gila banyak kali condensed mu. max 5';
                    }
                    await schema.findByIdAndUpdate(
                        id,
                        {
                            condensedCount: +args[1],
                        },
                        {
                            upsert: true,
                        }
                    );
                    const resin = await schema.findById(id);
                    sendEmbed(
                        'write',
                        resin.resinCount,
                        resin.fragileCount,
                        resin.condensedCount,
                        resin.transientCount
                    );
                } catch (e) {
                    sendError(e);
                } finally {
                    mongoose.connection.close();
                }
            });
            return;
        } else if (args[0] === 'fragile') {
            await mongo().then(async (mongoose) => {
                try {
                    if (isNaN(args[1])) {
                        throw `TypeError: cannot insert "args[1]" (type: ${typeof args[1]}) into field Number: isNaN`;
                    }
                    await schema.findByIdAndUpdate(
                        id,
                        {
                            fragileCount: +args[1],
                        },
                        {
                            upsert: true,
                        }
                    );
                    const resin = await schema.findById(id);
                    sendEmbed(
                        'write',
                        resin.resinCount,
                        resin.fragileCount,
                        resin.condensedCount,
                        resin.transientCount
                    );
                } catch (e) {
                    sendError(e);
                } finally {
                    mongoose.connection.close();
                }
            });
            return;
        } else if (args[0] === 'transient') {
            await mongo().then(async (mongoose) => {
                try {
                    if (isNaN(args[1])) {
                        throw `TypeError: cannot insert "args[1]" (type: ${typeof args[1]}) into field Number: isNaN`;
                    }
                    if (args[1] > 2) {
                        throw 'ga kena marah tubby apa kw beli banyak gitu. max 2';
                    }
                    await schema.findByIdAndUpdate(
                        id,
                        {
                            transientCount: +args[1],
                        },
                        {
                            upsert: true,
                        }
                    );
                    const resin = await schema.findById(id);
                    sendEmbed(
                        'write',
                        resin.resinCount,
                        resin.fragileCount,
                        resin.condensedCount,
                        resin.transientCount
                    );
                } catch (e) {
                    sendError(e);
                } finally {
                    mongoose.connection.close();
                }
            });
            return;
        } else if (args[0] === 'forceup') {
            try {
                if (!member.hasPermission('ADMINISTRATOR')) {
                    throw 'PermissionError: current context does not satisfy rule `author.HasPermission(\'ADMINISTRATOR\')`';
                }

                await mongo().then(async (mongoose) => {
                    try {
                        await schema.find((err, docs) => {
                            if (err) {
                                throw err;
                            }

                            docs.forEach(async (doc) => {
                                if (doc.resinCount >= 160) {
                                    return;
                                }
                                doc.resinCount++;
                                await doc.save();
                                if (doc.resinCount === 160) {
                                    const user = client.users.cache.get(doc._id);
                                    const embed = new Discord.MessageEmbed().setTitle('Resin full');

                                    message.channel.send(`${user}`, { embed: embed });
                                }

                                sendEmbed(
                                    'read',
                                    doc.resinCount,
                                    doc.fragileCount,
                                    doc.condensedCount,
                                    doc.transientCount
                                );
                            });
                        });
                    } catch(e) {
                        sendError(e);
                    } finally {
                        mongoose.connection.close();
                    }
                });
            } catch (e) {
                sendError(e);
            }
        } else {
            sendError(
                `Unknown argument "${args[0]}".\nAccepted arguments are: | <resinAmount> | condensed <condensedAmount> | fragile <fragileAmount> | transient <transientAmount>`
            );
        }
    },
};
