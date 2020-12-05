/* REQUIRED FILES */
const asciiTable = require('ascii-table');
const reload = require('require-reload');
const superagent = require('superagent');

/* REQUIRED FILES */
const config = reload('../config.json');
const utils = reload('../utils/utils.js');
const logger = new (reload('../utils/Logger.class.js'))(config.logTimestamps);

/* SET NUMBER FORMAT */
const numFormat = new Intl.NumberFormat('en-US');

module.exports = {
    name: 'bosses',
    description: 'Retrieves your boss kill-counts from the OSRS Hiscores.',
    usage: '<username>',
    aliases: ['kc'],
    cooldown: 10,
    hasArgs: true,
    execute(message, args) {
        let user = args.join(' ').trim();

        // Send a "bot is typing..." status immediately to notify user the bot is working
        message.channel.startTyping();

        utils.doHighScoresLookup('hiscore_bosses', user).then((result) => {
            if (result) {
                // Discord has a limit of 2000 characters per message.
                // To go around this the boss list is broken into two stages.
                // It feels janky but it works.
                let stage = 1;
                do {
                    let table = new asciiTable();

                    // Boss index offsets
                    let range = [];
                    if (stage < 2) {
                        range = [35, 56];
                    } else {
                        range = [57, 78];
                    }

                    table.setTitle(`VIEWING KILLED BOSSES FOR ${user.toUpperCase()} ${stage}/2`);
                    table.setHeading('Boss', 'Kill-count', 'Rank');
                    table.setBorder('|', '-', 'o', 'o');

                    for (let i = range[0]; i <= range[1]; i++) {
                        let count, rank;

                        count = (result[2][i][1] === '-1' || isNaN(result[2][i][1])) ? '--' : numFormat.format(result[2][i][1]);
                        rank = (result[2][i][0] === '-1' || isNaN(result[2][i][0])) ? 'N/A' : numFormat.format(result[2][i][0]);

                        table.addRow(utils.getSkillFromIndex(i), count, rank);
                    }

                    // There is output prepared. Print and stop "typing"
                    setTimeout(() => {
                        message.channel.send('```\n' + table.toString() + '```')
                            .then(() => {
                                message.channel.stopTyping();
                            }).catch((error) => {
                                reject(error);
                            });
                    }, 3000);

                    stage++;
                } while (stage <= 2);
            }
        }).catch(error => {
            message.channel.send(error);
            message.channel.stopTyping();
        });
    }
}