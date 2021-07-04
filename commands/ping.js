module.exports = {
    commands: 'ping',
    minArgs: 0,
    maxArgs: 1,
    callback: (client, message, args, text) => {
        message.channel.send('a');
    },
};
