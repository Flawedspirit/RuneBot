/* REQUIRE NODE 12+ TO USE THE BOT */
if(parseFloat(process.versions.node) < 12) throw new Error('Incompatible Node.js version. Please use version 12 or higher.');

/* REQUIRED DEPENDENCIES */
const Discord       = require('discord.js');
const fs            = require('fs');
const reload        = require('require-reload')(require);

/* REQUIRED FILES */
const config        = reload('./config.json');
const logger        = new(reload('./utils/Logger.class.js'))(config.logTimestamps);

const problemItems  = reload('./utils/problem_items.json');

/* LOCAL VARIABLES */
const client        = new Discord.Client();
client.commands     = new Discord.Collection();
client.cooldowns    = new Discord.Collection();

// Initialize commands
function loadCommands() {
    return new Promise(resolve => {
        const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

        for(let file of commandFiles) {
            let command = require(`./commands/${file}`);
            client.commands.set(command.name, command);
            
            if(config.debug || process.env.DEBUG) logger.logDebug(`Registered command: ${command.name}`, 'DEBUG//INIT');
        }
        resolve();
    });
}

function connect() {
    if(config.debug || process.env.DEBUG) logger.logDebug('Starting RuneBot in DEBUG mode.', 'DEBUG//INIT');

    logger.logBold('Connecting to Discord service...');
    client.login(config.token).catch(error => {
        logger.logError('Could not connect.');
    });
}

client.once('ready', () => {
    logger.log('RuneBot started successfully', 'green');
});

client.on('message', message => {
    // Ignore if message doesn't start with prefix or if it comes from the bot itself
    if(!message.content.startsWith(config.prefix) || message.author.bot) return;

    // Parse command input    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // Command doesn't even exist
    if(!command) return;

    // Provide usage info if arguments are omitted
    // Display per-command usage info if provided or a generic error if not
    if(command.hasArgs && !args.length) {
        let out = '';
        if(command.usage) {
            out = `**Usage:** ${config.prefix}[${command.name}|`;
            for(let i = 0; i < command.aliases.length; i++) {
                out += command.aliases[i] + ((i == command.aliases.length - 1 ) ? ']' : '|');
            }
            out += ` ${command.usage}`;
        } else {
            out = `Incorrect number of arguments for command: ${command.name}`;
        }
        return message.channel.send(out);
    }

    // Handle command cooldowns
    if(!client.cooldowns.has(command.name)) {
        // Create collection of commands with cooldowns
        // As well as a collection of users on cooldown
        client.cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const lastCommand = client.cooldowns.get(command.name);
    const cooldownTime = (command.cooldown || 0) * 1000;

    if(lastCommand.has(message.author.id)) {
        const expires = lastCommand.get(message.author.id) + cooldownTime;

        if(now < expires) {
            const timeLeft = (expires - now) / 1000;
            return message.reply(`please wait another ${timeLeft.toFixed(1)}s before using the \`${command.name}\` command again.`);
        }
    }

    // Makes sure cooldown list is cleared at the right time
    lastCommand.set(message.author.id, now);
    setTimeout(() => lastCommand.delete(message.author.id), cooldownTime);

    // Check if command is restricted to specified user IDs
    // If so, reject and DM the user with an error
    if(command.requireOwner && !config.owners.includes(message.author.id)) {
        return client.users.cache.get(message.author.id).send('This command can only be used by a server owner.');
    }

    try {        
        // Execute command if no other blocking condition exists
        command.execute(message, args);
    } catch(ex) {
        logger.logError(ex);
        message.reply(config.errorMessage);
    }
});

// Shall we begin?
loadCommands()
    .then(connect)
    .catch(error => {
        logger.logError(error, 'ERROR//INIT');
    });

// Gracefully shutdown on SIGINT from process
process.on('SIGINT', () => {
    logger.log('Node has requested SIGINT. Going down NOW!', 'red');
    client.destroy();
});
