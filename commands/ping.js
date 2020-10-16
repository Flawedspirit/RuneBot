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
    desc: 'Pings the bot',
    aliases: ['p'],
    cooldown: 3,
    execute(message) {
        let choice = ~~(Math.random() * responses.length);
        message.channel.send(responses[choice]);
    }
}