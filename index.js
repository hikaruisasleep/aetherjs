require ('dotenv').config();
const { Client } = require('discord.js');
const client = new Client();

const command = require('./command');
const { prefixes } = require('./config.json');
const lines = require ('./lines.json');

client.on('ready', () => {
    console.log('online');

    command(client, ['ping', 'test'], message => {
        message.channel.send('gdgdfsfsd');
    });
    command(client, 'resin', message => {
        message.reply('Connection to database failed');
    });
});

client.on('message', message => {
    const { content } = message;
    let prefix = false;
    for (const thisPrefix of prefixes) {
        if (content.startsWith(thisPrefix)) prefix = thisPrefix;
    }

    if (content == prefix) {
        const line = lines[Math.floor(Math.random() * lines.length)];
        message.channel.send(line);
    }
});

client.login(process.env.TOKEN);
