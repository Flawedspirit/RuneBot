/* REQUIRED DEPENDENCIES */
const asciiTable = require('ascii-table');
const reload = require('require-reload');

/* REQUIRED FILES */
const config = reload('../config.json');
const utils = reload('../utils/utils.js');
const logger = new (reload('../utils/Logger.class.js'))(config.logTimestamps);

/* SET NUMBER FORMAT */
const numFormat = new Intl.NumberFormat('en-US');

module.exports = {
    name: 'league',
    description: 'Retrieves your stats from the OSRS Seasonal Hiscores.\nThe current league is: Trailblazer',
    usage: '<username>',
    aliases: ['07league', 'hsl'],
    cooldown: 10,
    hasArgs: true,
    execute(message, args) {
        let user = args.join(' ').trim();

        // Send a "bot is typing..." status immediately to notify user the bot is working
        message.channel.startTyping();

        utils.doHighScoresLookup('hiscore_oldschool_seasonal', user).then((result) => {
            if (result) {
                // Discord has a limit of 2000 characters per message.
                // To go around this the boss list is broken into two stages.
                // It feels janky but it works.
                let stage = 1;
                do {
                    let table = new asciiTable();

                    let range = [];
                    if (stage == 1) {
                        range = [0, 23];
                    } else {
                        range = [24, 24];
                    }

                    table.setTitle(`VIEWING LEAGUE STATS FOR ${user.toUpperCase()} ${stage}/2`);
                    table.setHeading('Skill', 'Level', 'Experience', 'Rank');
                    table.setBorder('|', '-', 'o', 'o');

                    for (let i = range[0]; i <= range[1]; i++) {
                        let level, xp, rank;

                        level = (result[2][i][1] === '1' || isNaN(result[2][i][1])) ? '--' : numFormat.format(result[2][i][1]);
                        xp = (result[2][i][2] === '-1' || isNaN(result[2][i][2])) ? 'N/A' : numFormat.format(result[2][i][2]);
                        rank = (result[2][i][0] === '-1' || isNaN(result[2][i][0])) ? 'N/A' : numFormat.format(result[2][i][0]);

                        table.addRow(utils.getSkillFromIndex(i), level, xp, rank);
                    }

                    // There is output prepared. Print and stop "typing"
                    setTimeout(() => {
                        message.channel.send('```\n' + table.toString() + '```')
                            .then(() => {
                                message.channel.stopTyping();
                            }).catch(error => {
                                reject(error);
                            });
                    }, 3000);

                    stage++;
                } while (stage <= 2);
            }
        }).catch(error => {
            logger.logError(`${error}\n${error.stack}`);
            message.channel.send(config.errorMessage);
            message.channel.stopTyping();
        });
    }
}