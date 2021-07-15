const Discord = require('discord.js');
const links = require('../links.json');

module.exports = {
    commands: 'jadwal',
    callback: (client, message, args, text) => {
        for (const linkSet in links) {
            if (linkSet.lesson === args) {
                const embed = new Discord.MessageEmbed()
                    .setTitle('Link zoom')
                    .addField(`Link ${linkSet.lesson}`, linkSet.link);

                message.channel.send(embed);
                return;
            }
        }
    },
};
