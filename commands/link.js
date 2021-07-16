const Discord = require('discord.js');
const links = require('../links.json');

module.exports = {
    commands: 'link',
    callback: (client, message, args, text) => {
        const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
        const cleantext = text.toLowerCase().replace(regex, '').replace(/ /g, '');

        if(!args[0]) {
            const linkList = [];

            for (const linkSet of links) {
                linkList.push(linkSet.lesson);
            }

            const embed = new Discord.MessageEmbed()
                .setTitle('Link yang ada')
                .setDescription(linkList);

            message.channel.send(embed);

            return;
        }

        try {
            for (const linkSet of links) {
                if (cleantext == linkSet.lesson.toLowerCase().replace(regex, '').replace(/ /g, '')) {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Link zoom');

                    if (linkSet.lesson.toLowerCase().replace(regex, '').replace(/ /g, '') == "universal")
                        embed.addField(`Link ABRAHAM IPA 2`, linkSet.link);
                    } else {
                        embed.addField(`Link ${linkSet.lesson}`, linkSet.link);
                    }

                    message.channel.send(embed);
                    return;
                }
            }
            throw 'Pelajaran apa itu';
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
