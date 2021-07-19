const Discord = require('discord.js');
const schedule = require('../jadwal.json');
const strftime = require('../strftime');

module.exports = {
    commands: 'jadwal',
    callback: (client, message, args, text) => {
        const date = new Date();

        function currentLesson() {
            for(const table of schedule) {
                console.log(strftime('%A', date).toLowerCase());
                console.log(table.day);
                if(strftime('%A', date).toLowerCase() == table.day) {
                    for(const column of table.schedule) {
                        console.log(strftime('%k', date).toLowerCase());
                        console.log(column.cronTime.cronHour);
                        if((strftime('%k', date) == column.cronTime.cronHour) && column.lesson) {
                            return column.lesson;
                        }
                    }
                } else {
                    return 'lagi ga belajar';
                }
            }
        }

        const embed = new Discord.MessageEmbed()
            .setTitle('Jadwal')
            .addFields(
                { name: 'Hari', value: `${strftime('%A', date)}`, inline: true },
                { name: 'Jam', value: `${strftime('%H:%M', date)}`, inline: true },
                { name: 'Pelajaran', value: currentLesson(), inline: false }
            )
            .setImage('https://cdn.discordapp.com/attachments/775253878312009775/864298701556285450/1626135257323.jpg');

        message.channel.send(embed);
    },
};
