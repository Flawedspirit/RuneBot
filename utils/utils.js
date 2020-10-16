/**
 * @desc Contains various helper functions.
 * @module Utils
 */

/**
 * Gets the name of a skill based on its hiscores index number.
 * @param {Number} index An index value between 0 and 23 (inclusive).
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
        'Construction'
    ];

    return skillName[index];
}