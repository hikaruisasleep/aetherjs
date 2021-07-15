const Discord = require('discord.js');
const schedule = require('./jadwal.json');

module.exports = {
    commands: 'jadwal',
    callback: (client, message, args, text) => {
        const date = new Date();
        var time = `${date.getHours()}:${date.getMinutes()}`;

        const embed = new Discord.MessageEmbed()
            .setTitle('Jadwal')
            .addFields(
                { name: 'Jam', value: time, inline: true },
                { name: 'Pelajaran', value: '', inline: true }
            )
            .setImage('https://cdn.discordapp.com/attachments/775253878312009775/864298701556285450/1626135257323.jpg');

        message.channel.send(embed);
    },
};
