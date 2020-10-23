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
    name: 'bosses',
    description: 'Retrieves your boss kill-counts from the OSRS Hiscores.',
    usage: '<username>',
    aliases: ['bosses', 'kc'],
    cooldown: 10,
    hasArgs: true,
    execute(message, args) {
        let user = args.join(' ').trim();

        // Sanity test to make sure input can only be a valid username
        if(!/^[A-Za-z0-9\-\ ]+$/.test(user) || user.length > 12) {
            return message.channel.send('That is not a valid RuneScape username.');
        }

        // Everything should be fine at this point. Perform the lookup
        superagent.get(`https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${user}`)
        .end((error, response) => {
            if(error) {
                logger.logWarn(`Error parsing hiscores: ${error.status || error.response}`);
                return message.channel.send(`there was an issue looking up stats for ${user}. Please try again later.`);
            } else {
                // Send a "bot is typing..." status immediately to notify user the bot is working
                message.channel.startTyping();

                let statResponse = response.text.split('\n');
                let result = [];
                
                // Discord has a limit of 2000 characters per message.
                // To go around this the boss list is broken into two stages.
                // It feels janky but it works.
                let stage = 1;
                do {
                    // Boss index offsets
                    let max, min;
                    if(stage < 2) {
                        min = 35;
                        max = 56;
                    } else {
                        min = 57;
                        max = 78;
                    }

                    for(let i = min; i <= max; i++) {
                        result[i] = statResponse[i].split(',');
                    }
                    let table = new asciiTable();
                    table.setTitle(`VIEWING KILLED BOSSES FOR ${user.toUpperCase()} ${stage}/2`);
                    table.setHeading('Boss', 'Kill-count', 'Rank');
                    table.setBorder('|', '-', 'o', 'o');
    
                    for(let i = min; i <= max; i++) {
                        let count, rank;
    
                        count   = (result[i][1] === '-1') ? '--' : numFormat.format(result[i][1]);
                        rank    = (result[i][0] === '-1') ? 'N/A' : numFormat.format(result[i][0]);
    
                        table.addRow(utils.getSkillFromIndex(i), count, rank);
                    }
    
                    // There is output prepared. Print and stop "typing"
                    setTimeout(() => {
                        message.channel.send('```\n' + table.toString() + '```')
                        .then(() => {
                            message.channel.stopTyping();
                        }).catch((error) => {
                            logger.logError(error);
                        });
                    }, 3000);

                    stage++;
                } while(stage <= 2);
            }
        });
    }
}