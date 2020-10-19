/* REQUIRED DEPENDENCIES */
const asciiTable    = require('ascii-table');
const reload        = require('require-reload');

/* REQUIRED FILES */
const utils         = reload('../utils/utils.js');

/* SET NUMBER FORMAT */
const numFormat     = new Intl.NumberFormat('en-US');

module.exports = {
    name: 'ironstats',
    description: 'Retrieves your stats from the OSRS Ironman Hiscores',
    usage: '<username>',
    aliases: ['07stats-im', 'hsim'],
    cooldown: 10,
    hasArgs: true,
    execute(message, args) {
        let user = args.join(' ').trim();
        let table = new asciiTable();

        // Send a "bot is typing..." status immediately to notify user the bot is working
        message.channel.startTyping();

        utils.doHighScoresLookup('hiscore_oldschool_ironman', user).then((result) => {
            if(result) {
                table.setTitle(`VIEWING IRONMAN STATS FOR ${user.toUpperCase()}`);
                table.setHeading('Skill', 'Level', 'Experience', 'Rank');
                table.setBorder('|', '-', 'o', 'o');
    
                for(let i = result[0]; i <= result[1]; i++) {
                    let level, xp, rank;
        
                    level   = (result[2][i][1] === '1')  ? '--'  : numFormat.format(result[2][i][1]);
                    xp      = (result[2][i][2] === '-1') ? 'N/A' : numFormat.format(result[2][i][2]);
                    rank    = (result[2][i][0] === '-1') ? 'N/A' : numFormat.format(result[2][i][0]);
        
                    table.addRow(utils.getSkillFromIndex(i), level, xp, rank);
                }
            }

            // There is output prepared. Print and stop "typing"
            setTimeout(() => {
                message.channel.send('```\n' + table.toString() + '```')
                .then(() => {
                    message.channel.stopTyping();
                });
            }, 3000);
        }).catch(error => {
            message.channel.send(error);
            message.channel.stopTyping();
        });
    }
}