/* REQUIRED FILES */
const reload = require('require-reload');

/* REQUIRED FILES */
const config = reload('../config.json');

module.exports = {
    name: 'invite',
    description: 'Creates an invite link for this bot.',
    aliases: ['oauth', 'join'],
    cooldown: 10,
    execute(message) {
        if (config.inviteLink) {
            message.author.send(`Add me to a server! ${config.inviteLink}\nMake sure you're logged in.`);
        } else {
            message.author.send('No invite link defined.');
        }
    }
}