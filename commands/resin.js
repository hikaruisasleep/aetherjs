const Discord = require('discord.js');

module.exports = {
    commands: ['resin', 'resincount'],
    minArgs: 0,
    maxArgs: 2,
    callback: async (client, message, args, text) => {
        const embed = new Discord.MessageEmbed()
            .setTitle('rusak')
            .setDescription('❌ code nya jele, nanti la ku update');

        message.channel.send(embed);
    }
};
