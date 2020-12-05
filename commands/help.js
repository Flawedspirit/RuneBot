/* REQUIRED DEPENDENCIES */
const Discord = require('discord.js');
const fs = require('fs');
const reload = require('require-reload')(require);

/* REQUIRED FILES */
const config = reload('../config.json');

module.exports = {
    name: 'help',
    description: 'List all of RuneBot\'s commands.',
    aliases: ['commands', '?'],
    cooldown: 5,
    execute(client, message) {
        const messageOut = new Discord.MessageEmbed()
            .setColor('#d4af37')
            .setTitle('RuneBot Help')
            .setDescription('Hello there! ( ͡° ͜ʖ ͡°)')
            .setThumbnail(client.user.displayAvatarURL());

        const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

        for (let file of commandFiles) {
            let command = require(`./${file}`);

            if (!command.hidden) {
                let useMessage = `${config.prefix}${command.name}`;

                if (command.aliases) {
                    useMessage += ' [';
                    for (let i = 0; i < command.aliases.length; i++) {
                        useMessage += command.aliases[i] + ((i == command.aliases.length - 1) ? ']' : '|');
                    }
                }
                messageOut.addField(useMessage, command.description);
            }
        }

        message.author.send(messageOut);
    }
}