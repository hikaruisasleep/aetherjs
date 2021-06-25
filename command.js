const { prefixes } = require('./config.json');

module.exports = (client, aliases, callback) => {
    if (typeof aliases === 'string') aliases = [aliases];

    client.on('message', message => {
        const { content } = message;
        let prefix = false;
        for (const thisPrefix of prefixes) {
            if (content.startsWith(thisPrefix)) prefix = thisPrefix;
        }

        aliases.forEach(alias => {
            const command = `${prefix} ${alias}`;
            if (content.startsWith(`${command} `) || content === command) callback(message);
        });
    });
};