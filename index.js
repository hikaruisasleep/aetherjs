const path = require('path');
const fs = require('fs');
const scheduler = require('node-schedule');
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix } = require('./config.json');

const mongo = require('./mongo');

const lines = require('./lines.json');
const schedule = require('./jadwal.json');
const links = require('./links.json');

client.on('ready', async () => {
    console.log('online');

    await mongo().then((mongoose) => {
        try {
            console.log('Connected to DB');
        } finally {
            mongoose.connection.close();
        }
    });

    client.user.setPresence({ activity: { name: 'cari adek', type: 'COMPETING' }, status: 'online' })
        .then(console.log)
        .catch(console.error);

    const server = client.guilds.cache.get('775253878312009768');
    const general = client.channels.cache.get('776357197508116481');
    const linkchannel = client.channels.cache.get('775254327698784297');
    const ipa2 = server.roles.cache.find(role => (role.id) === '784219177564635167');

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

    scheduler.scheduleJob('0 13 * * 0', async () => {
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

    for(const table of schedule) {
        for(const column of table.schedule) {
            scheduler.scheduleJob(`${column.cronTime.cronMinute} ${column.cronTime.cronHour} * * ${table.cronDay}`, () => {
                const embed = new Discord.MessageEmbed()
                    .setTitle('Pelajaran baru')
                    .addFields(
                        { name: 'Pelajaran', value: column.lesson, inline: true },
                        { name: 'Jam', value: column.time, inline: true }
                    );

                if (column.lesson != 'Pulang') {
                    embed.addField('Link Zoom ABRAHAM IPA 2', links[0].link);
                }

                linkchannel.send(`${ipa2}`, { embed: embed });
            });
        }
    }
});

client.on('message', (message) => {
    const { content } = message;

    if (content == prefix) {
        const line = lines[Math.floor(Math.random() * lines.length)];
        message.channel.send(line);
    }
});

client.login(process.env.TOKEN);
