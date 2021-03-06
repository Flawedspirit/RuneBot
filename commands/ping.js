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
    'Ping yourself!',
    'Reporting for duty!',
    'One ping only, Vasily.',
    'That tickles!',
    'At your service!',
    'O rly?',
    'Oooh! ( ͡° ͜ʖ ͡°)',
    'Да, Comrade?'
];

module.exports = {
    name: 'ping',
    description: 'Pings the bot to make sure it\'s paying attention.',
    aliases: ['p', 'poke'],
    cooldown: 1,
    execute(_, message) {
        let choice = ~~(Math.random() * responses.length);
        message.author.send(responses[choice]);
    }
}