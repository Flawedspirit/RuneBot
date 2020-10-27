/* REQUIRED DEPENDENCIES */
const Discord       = require('discord.js');
const reload        = require('require-reload');

/* REQUIRED FILES */
const utils         = reload('../utils/utils.js');

/* SET NUMBER FORMAT */
const numFormat     = new Intl.NumberFormat('en-US');

module.exports = {
    name: 'price',
    description: 'Retrieves data on an item from the Grand Exchange.',
    usage: '<item>',
    aliases: ['07price', 'ge'],
    cooldown: 5,
    hasArgs: true,
    execute(message, args) {
        let item = args.join(' ').trim();

        // Send a "bot is typing..." status immediately to notify user the bot is working
        message.channel.startTyping();

        utils.doItemLookup(item).then((result) => {
            let members = result.members;
            let memMessage = [];

            if(members) {
                memMessage = ['Members', 'https://files.flawedspirit.ca/runebot/member.png'];
            } else {
                memMessage = ['Free-to-play', 'https://files.flawedspirit.ca/runebot/free.png'];
            }

            const messageOut = new Discord.MessageEmbed()
            .setColor('#d4af37')
            .setTitle(result.name)
            .setDescription(result.description)
            .setThumbnail(result.icon)
            .addField('Price', `${numFormat.format(result.price.current)} gp`)
            .addField(
                'Change', `\u2043 **Today:** ${numFormat.format(result.price.change.today)} gp\n` +
                `\u2043 **30 days:** ${numFormat.format(result.price.change.day30)} gp\n` +
                `\u2043 **90 days:** ${numFormat.format(result.price.change.day90)} gp\n` +
                `\u2043 **180 days:** ${numFormat.format(result.price.change.day180)} gp`
            )
            .setTimestamp()
            .setFooter(memMessage[0], memMessage[1])

            //There is output prepared. Print and stop "typing"
            setTimeout(() => {
                message.channel.send(messageOut)
                .then(() => {
                    message.channel.stopTyping();
                });
            }, 0);
        }).catch(error => {
            message.channel.send(error);
            message.channel.stopTyping();
        });
    }
}