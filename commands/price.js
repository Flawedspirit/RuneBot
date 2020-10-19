/* REQUIRED DEPENDENCIES */
const asciiTable    = require('ascii-table');
const reload        = require('require-reload');

/* REQUIRED FILES */
const utils         = reload('../utils/utils.js');

/* SET NUMBER FORMAT */
const numFormat     = new Intl.NumberFormat('en-US');

module.exports = {
    name: 'price',
    description: 'Retrieves data on an item from the Grand Exchange',
    usage: '<item>',
    aliases: ['07price'],
    cooldown: 10,
    hasArgs: true,
    execute(message, args) {
        let item = args.join(' ').trim();
        let table = new asciiTable();

        // Send a "bot is typing..." status immediately to notify user the bot is working
        message.channel.startTyping();

        utils.doItemLookup(item).then((result) => {
            if(result) {

            }

            // There is output prepared. Print and stop "typing"
            // setTimeout(() => {
            //     message.channel.send('```\n' + table.toString() + '```')
            //     .then(() => {
            //         message.channel.stopTyping();
            //     });
            // }, 3000);
        }).catch(error => {
            message.channel.send(error);
            message.channel.stopTyping();
        });
    }
}