/* REQUIRED FILES */
const reload    = require('require-reload');

/* REQUIRED FILES */
const config    = reload('../config.json');
const logger    = new(reload('../utils/Logger.class.js'))(config.logTimestamps);

module.exports = {
    name: 'reload',
    description: 'Reloads a command.',
    usage: '<command>',
    cooldown: 10,
    hidden: true,
    requireOwner: true,
    hasArgs: true,
    execute(message, args) {
        if(!args.length) {
            return message.channel.send('You must provide a command to reload.');
        } else {
            const commandName = args[0].toLowerCase();
            const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if(!command) return message.channel.send(`There is no such command or alias: \'${commandName}\'`);

            delete require.cache[require.resolve(`./${command.name}.js`)];

            try {
                const newCommand = require(`./${command.name}.js`);
                message.client.commands.set(newCommand.name, newCommand);
                message.channel.send(`Reloaded command: ${command.name}.`);
            } catch(ex) {
                logger.logError(`${ex}\n${ex.stack}`, 'ERROR//CMD');
                message.channel.send(config.errorMessage);
            }
        }
    }
}