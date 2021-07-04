module.exports = {
    commands: 'ping',
    minArgs: 0,
    maxArgs: 1,
    callback: (client, message, args, text) => {
        message.channel.send('Pinging...').then((m) => {
            var ping = m.createdTimestamp - message.createdTimestamp;
            var botPing = Math.round(ping.pi);

            m.edit(`**:ping_pong: ${botPing}ms`);
        });
    },
};
