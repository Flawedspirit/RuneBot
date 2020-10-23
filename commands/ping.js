const responses = [
    'Hey!',
    'Pong!',
    'Polo!',
    'Aww... I wanted to say ping!',
    'I\'m up! I\'m up...',
    'Yes?',
    'You have my attention, outlander.',
    '...',
    'Not dignifying that with a response.',
    'Ping yourself!'
];

module.exports = {
    name: 'ping',
    description: 'Pings the bot to make sure it\'s paying attention.',
    aliases: ['p'],
    cooldown: 1,
    execute(message) {
        let choice = ~~(Math.random() * responses.length);
        message.channel.send(responses[choice]);
    }
}