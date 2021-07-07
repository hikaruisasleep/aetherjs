const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix } = require('./config.json');

const mongo = require('./mongo');

const lines = require('./lines.json');

client.on('ready', async () => {
    console.log('online');

    await mongo().then((mongoose) => {
        try {
            console.log('Connected to DB');
        } finally {
            mongoose.connection.close();
        }
    });

    const general = client.channels.cache.get('776357197508116481');

    const baseFile = 'command-base.js';
    const commandBase = require(`./commands/${baseFile}`);
    const readCmds = (dir) => {
        const files = fs.readdirSync(path.join(__dirname, dir));
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                readCmds(path.join(dir, file));
            } else if (file !== baseFile) {
                const opts = require(path.join(__dirname, dir, file));
                commandBase(opts);
            }
        }
    };
    readCmds('commands');
    commandBase.listen(client);

    setInterval(async () => {
        const schema = require('./schemas/resin-schema');
        await mongo().then(async (mongoose) => {
            try {
                await schema.find((err, docs) => {
                    if (err) {
                        return console.error(err);
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

                            general.send(`${user}`, { embed: embed });
                        }
                    });
                });
            } finally {
                mongoose.connection.close();
            }
        });
    }, 480000);

    schedule.scheduleJob('0 13 * * 0', async () => {
        const schema = require('./schemas/resin-schema');
        const transientEmoji = client.emojis.cache.find(
            (emoji) => emoji.name === 'Aether_transientresin'
        );
        await mongo().then(async (mongoose) => {
            try {
                await schema.find((err, docs) => {
                    if (err) {
                        throw err;
                    }

                    docs.forEach(async (doc) => {
                        if (doc.transientCount) {
                            const embed = new Discord.MessageEmbed()
                                .setTitle('BESOK SENIN AYO HABISIN TRANSIENTMU')
                                .addField(transientEmoji, doc.transientCount, false);

                            const user = client.users.cache.get(doc._id);

                            general.send(`${user}`, { embed: embed });
                        }
                    });
                });
            } catch (e) {
                const embed = new Discord.MessageEmbed()
                    .setTitle('rusak')
                    .setDescription(`❌ ${e}`);

                general.send(embed);
            } finally {
                mongoose.connection.close();
            }
        });
    });
});

client.on('message', (message) => {
    const { content } = message;

    if (content == prefix) {
        const line = lines[Math.floor(Math.random() * lines.length)];
        message.channel.send(line);
    }
});

client.login(process.env.TOKEN);
