/* REQUIRED DEPENDENCIES */
const superagent    = require('superagent');
const reload        = require('require-reload');

/* REQUIRED FILES */
const config        = reload('../config.json');
const logger        = new(reload('../utils/Logger.class.js'))(config.logTimestamps);

/**
 * @desc Contains various helper functions.
 * @module Utils
 */

/**
 * Gets the name of a skill or activity based on its hiscores index number.
 * @param {Number} index An index value between 0 and 78 (inclusive).
 * @returns {String} The skill name.
 */
exports.getSkillFromIndex = function(index) {
    let skillName = [
        'Overall',
        'Attack',
        'Defence',
        'Strength',
        'Hitpoints',
        'Ranged',
        'Prayer',
        'Magic',
        'Cooking',
        'Woodcutting',
        'Fletching',
        'Fishing',
        'Firemaking',
        'Crafting',
        'Smithing',
        'Mining',
        'Herblore',
        'Agility',
        'Thieving',
        'Slayer',
        'Farming',
        'Runecrafting',
        'Hunter',
        'Construction',
        'League Points',
        'Bounty Hunter - Hunter',
        'Bounty Hunter - Rogue',
        'Clue Scrolls (all)',
        'Clue Scrolls (beginner)',
        'Clue Scrolls (easy)',
        'Clue Scrolls (medium)',
        'Clue Scrolls (hard)',
        'Clue Scrolls (elite)',
        'Clue Scrolls (master)',
        'LMS - Rank',
        'Abyssal Sire',
        'Alchemical Hydra',
        'Barrows Chests',
        'Bryophyta',
        'Callisto',
        'Cerberus',
        'Chambers of Xeric',
        'CoX: Challenge Mode',
        'Chaos Elemental',
        'Chaos Fanatic',
        'Commander Zilyana',
        'Corporeal Beast',
        'Crazy Archaeologist',
        'Dagannoth Prime',
        'Dagannoth Rex',
        'Dagannoth Supreme',
        'Deranged Archaeologist',
        'General Graardor',
        'Giant Mole',
        'Grotesque Guardians',
        'Hespori',
        'Kalphite Queen',
        'King Black Dragon',
        'Kraken',
        'Kree\'Arra',
        'K\'ril Tsutsaroth',
        'Mimic',
        'Nightmare',
        'Obor',
        'Sarachnis',
        'Scorpia',
        'Skotizo',
        'The Gauntlet',
        'The Corrupted Gauntlet',
        'Theatre of Blood',
        'Thermonuclear Smoke Devil',
        'TzKal-Zuk',
        'TzTok-Jad',
        'Venenatis',
        'Vet\'ion',
        'Vorkath',
        'Wintertodt',
        'Zalcano',
        'Zulrah'
    ];

    return skillName[index];
}

/**
 * Parses the OSRS hiscores and returns a string array of skills, exp, and rankings.
 * @param {String} hiscore Which OSRS hiscore to parse. Choices include:
 * <ul>
 *  <li>hiscore_oldschool</li>
    <li>hiscore_oldschool_ironman</li>
    <li>hiscore_oldschool_hardcore_ironman</li>
    <li>hiscore_oldschool_ultimate</li>
    <li>hiscore_oldschool_deadman</li>
 * </ul
 * @param {String} user A RuneScape username.
 * @param {Boolean} [bossMode=false] Whether to return the boss killcount.
 * @returns {Array<String>}
 */
exports.doHighScoresLookup = function(message, hiscore, user, bossMode = false) {
    return new Promise((resolve, reject) => {
        let lookupIndex = [];
        switch(hiscore) {
            case('hiscore_oldschool'):
            case('hiscore_oldschool_ironman'):
            case('hiscore_oldschool_hardcore_ironman'):
            case('hiscore_oldschool_ultimate'):
            case('hiscore_oldschool_deadman'):
            lookupIndex = [0, 23];
        }

        // Sanity test to make sure input can only be a valid username
        if(!/^[A-Za-z0-9\-\ ]+$/.test(user) || user.length > 12) {
            reject('That is not a valid RuneScape username.');
        }

        // Everything should be fine at this point. Perform the lookup
        superagent.get(`https://secure.runescape.com/m=${hiscore}/index_lite.ws?player=${user}`)
        .end((error, response) => {
            if(error) {
                logger.logWarn(`Error parsing hiscores: ${error.status || error.response}`);
                reject(`There was an issue looking up stats for ${user}. Please try again later.`);
            } else {
                let statResponse = response.text.split('\n');
                let result = [];

                for(let i = lookupIndex[0]; i <= lookupIndex[1]; i++) {
                    result[i] = statResponse[i].split(',');
                }
                
                resolve(result);
            }      
        });
    });   
}