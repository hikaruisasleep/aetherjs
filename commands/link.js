const Discord = require('discord.js');
const links = require('../links.json');

module.exports = {
    commands: 'link',
    callback: (client, message, args, text) => {
        try {
            const embed = new Discord.MessageEmbed()
                .setTitle('Link zoom')
                .addField('Link ABRAHAM IPA 2', links[0].link);

            message.channel.send(embed);
            return;
        } catch (e) {
            const embed = new Discord.MessageEmbed()
                .setTitle('rusak')
                .setDescription('❌ kw habis ngapain pantek')
                .setFooter(e);

            message.channel.send(embed);
            return;
        }
    },
};
