/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
//Use: https://github.com/screeps/tutorial-scripts/tree/master/section5

/*
 * Setup IDE
 * See: https://www.youtube.com/watch?v=edBMmOAfJ-Q
 * See: https://steamcommunity.com/sharedfiles/filedetails/?id=803169758
 * Use: https://steamcommunity.com/sharedfiles/filedetails/?id=1183135070
 * Use: https://steamcommunity.com/sharedfiles/filedetails/?id=1183135070#comment_content_1711815918575230079
 * 
 * Toggle Comments
 * Use: https://marketplace.visualstudio.com/items?itemName=munyabe.ToggleComment
 **/

var spawner = require('spawner');
var CreepHelper = require("helper.creep");

module.exports.loop = function () {
    spawner.spawn_creeps();

    // Iterate through all the friendly creeps and have them take an action
    try {
        for (let creepName in Game.creeps) {
            let creep = CreepHelper.createCreepByName(creepName);
            creep.act();
        }
    } catch (error) {
        console.log("Error: " + error + "\n" + error.stack);
    }
}