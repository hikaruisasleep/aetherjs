const { prefix } = require('../config.json');
const errorMsg = 'bot nya rusak';

const allCmds = {};

module.exports = (commandOpts) => {
    let { commands, permissions = [] } = commandOpts;

    if (typeof commands === 'string') {
        commands = [commands];
    }

    for (const command of commands) {
        allCmds[command] = {
            ...commandOpts,
            commands,
            permissions,
        };
    }
};

module.exports.listen = (client) => {
    client.on('message', (message) => {
        const { member, content, guild } = message;

        const args = content.split(/[ ]+/);
        const name = args.shift().toLowerCase();

        if (name.startsWith(prefix)) {
            const cmd = allCmds[name.replace(prefix, '')];
            if (!cmd) {
                return;
            }

            const {
                permissions,
                permissionError = errorMsg,
                requiredRoles = [],
                minArgs = 0,
                maxArgs = null,
                expectedArgs,
                callback,
            } = cmd;

            for (const permission of permissions) {
                if (!member.hasPermission(permission)) {
                    message.reply(permissionError);
                }
            }

            if (args.length < minArgs || (maxArgs !== null && args.length > maxArgs)) {
                message.reply(errorMsg);
                return;
            }

            callback(client, message, args, args.join(' '));
        }
    });
};
