module.exports = {
    name: 'reset',
    description: 'Gets the time until the daily game reset.',
    cooldown: 3,
    execute(message) {
        let resetTime = new Date().setUTCHours(24, 0, 0, 0) - Date.now();
        let result = '';

        let hours = Math.floor(resetTime / 1000 / 60 / 60);
        resetTime -= hours * 1000 * 60 * 60;

        let minutes = Math.floor(resetTime / 1000 / 60);
        resetTime -= minutes * 1000 * 60;

        if (hours > 0) result += `${hours} hour${hours > 1 ? 's' : ''} `;
        if (minutes > 0) result += `${minutes} minute${minutes > 1 ? 's' : ''}`;

        message.channel.send(`The daily reset is **${result}** from your local time.`);
    }
}