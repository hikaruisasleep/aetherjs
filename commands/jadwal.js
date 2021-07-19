const Discord = require('discord.js');
const schedule = require('../jadwal.json');
const strftime = require('../strftime');

module.exports = {
    commands: 'jadwal',
    callback: (client, message, args, text) => {
        const date = new Date();

        function currentLesson() {
            for(const table of schedule) {
                console.log(date);
                console.log(strftime('%e', date));
                console.log(strftime('%k', date));
                if(strftime('%e', date) == table.day) {
                    for(const column of table.schedule) {
                        if((strftime('%k', date) == column.cronTime.cronHour) && column.lesson) {
                            return column.lesson;
                        } else {
                            return 'lagi ga belajar';
                        }
                    }
                }
            }
        }

        const embed = new Discord.MessageEmbed()
            .setTitle('Jadwal')
            .addFields(
                { name: 'Jam', value: `${strftime('%H:%M', date)}`, inline: true },
                { name: 'Pelajaran', value: currentLesson(), inline: true }
            )
            .setImage('https://cdn.discordapp.com/attachments/775253878312009775/864298701556285450/1626135257323.jpg');

        message.channel.send(embed);
    },
};
