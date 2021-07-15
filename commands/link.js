const Discord = require('discord.js');
const links = require('../links.json');

module.exports = {
    commands: 'jadwal',
    callback: (client, message, args, text) => {
        if(!args) {
            const linkList = [];

            for (const linkSet in links) {
                linkList.push(linkSet.lesson);
            }

            const embed = new Discord.MessageEmbed()
                .setTitle('Link yang ada')
                .setDescription(linkList);

            message.channel.send(embed);
        }

        for (const linkSet in links) {
            try {
                if (linkSet.lesson === args) {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Link zoom')
                        .addField(`Link ${linkSet.lesson}`, linkSet.link);

                    message.channel.send(embed);
                    return;
                } else {
                    throw 'Pelajaran apa itu';
                }
            } catch (e) {
                const embed = new Discord.MessageEmbed()
                    .setTitle('rusak')
                    .setDescription('❌ kw habis ngapain pantek')
                    .setFooter(e);

                message.channel.send(embed);
            }
        }
    },
};
