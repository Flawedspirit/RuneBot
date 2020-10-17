/* REQUIRED DEPENDENCIES */
const asciiTable    = require('ascii-table');
const reload        = require('require-reload');

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
        let user = args.join(' ').trim();
        const hiscores = utils.doHighScoresLookup(message, 'hiscore_oldschool', user).then(() => {

            console.log(hiscores);
            // Send a "bot is typing..." status immediately to notify user the bot is working
            message.channel.startTyping();

            let table = new asciiTable();
            table.setTitle(`VIEWING STATS FOR ${user.toUpperCase()}`);
            table.setHeading('Skill', 'Level', 'Experience', 'Rank');
            table.setBorder('|', '-', 'o', 'o');

            for(let i = 0; i <= 23; i++) {
                let level, xp, rank;
    
                level   = (hiscores[i][1] === '1') ? '--' : numFormat.format(result[i][1]);
                xp      = (hiscores[i][2] === '-1') ? 'N/A' : numFormat.format(result[i][2]);
                rank    = (hiscores[i][0] === '-1') ? 'N/A' : numFormat.format(result[i][0]);
    
                table.addRow(utils.getSkillFromIndex(i), level, xp, rank);
            }

            // There is output prepared. Print and stop "typing"
            setTimeout(() => {
                message.channel.send('```\n' + table.toString() + '```')
                .then(() => {
                    message.channel.stopTyping();
                }).catch((error) => {
                    logger.logError(error, 'ERROR//CMD');
                });
            }, 3000);
        }).catch(error => {
            logger.logError(error, 'ERROR//CMD');
        });
    }
}