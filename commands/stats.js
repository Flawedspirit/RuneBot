/* REQUIRED FILES */
const asciiTable    = require('ascii-table');
const reload        = require('require-reload');
const superagent    = require('superagent');

/* REQUIRED FILES */
const config        = reload('../config.json');
const utils         = reload('../utils/utils.js');
const logger        = new(reload('../utils/Logger.class.js'))(config.logTimestamps);

/* SET NUMBER FORMAT */
const numFormat     = new Intl.NumberFormat('en-US');

module.exports = {
    name: 'stats',
    description: 'Retrieves your stats from the OSRS Hiscores',
    usage: '<username>',
    aliases: ['07stats', 'hiscores', 'hs'],
    cooldown: 10,
    hasArgs: true,
    execute(message, args) {
        // Send a "bot is typing..." status immediately to notify user the bot is working
        message.channel.startTyping();

        //let user = '';
        // if(!args.length) {
        //     return message.channel.send('You must provide a Old School RuneScape username.');
        // } else {
            let user = args.join(' ').trim();

            // Sanity test to make sure input can only be a valid username
            if(!/^[A-Za-z0-9\-\ ]+$/.test(user) || user.length > 12) {
                return message.channel.send('That is not a valid RuneScape username.');
            }
        //}

        // Everything should be fine at this point. Perform the lookup
        superagent.get(`https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${user}`)
        .end((error, response) => {
            if(error) {
                logger.logWarn(`Error parsing hiscores: ${error.status || error.response}`);
                message.channel.send(`there was an issue looking up stats for ${user}. Please try again later.`);
            } else {
                let statResponse = response.text.split('\n');
                let result = [];

                for(let i = 0; i < 24; i++) {
                    result[i] = statResponse[i].split(',');
                }
                let table = new asciiTable();
                table.setTitle(`VIEWING STATS FOR ${user.toUpperCase()}`);
                table.setHeading('Skill', 'Level', 'Experience', 'Rank');
                table.setBorder('|', '-', 'o', 'o');

                for(let i = 0; i < 24; i++) {
                    if(result[i][1] === '1') result[i][1] = '[Not ranked]';

                    table.addRow(utils.getSkillFromIndex(i), result[i][1], numFormat.format(result[i][2]), numFormat.format(result[i][0]));
                }

                // There is output prepared. Print and stop "typing"
                setTimeout(() => {
                    message.channel.send('```\n' + table.toString() + '```')
                    .then(() => {
                        message.channel.stopTyping();
                    });
                }, 3000);
            }
        });
    }
}