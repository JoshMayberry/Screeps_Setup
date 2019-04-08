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

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var spawner = require('spawner');


module.exports.loop = function () {
    spawner.spawn_creeps();

    // Iterate through all the friendly creeps and have them take an action
    let CreepHelper = require('helper.creep');

    try {
        for (let creepName in Game.creeps) {
            let creep = CreepHelper.createCreepByName(creepName);
            creep.act();
        }
    } catch (error) {
        console.log('Error: ' + error);
        console.log('Error: ' + error.stack);
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        switch (creep.memory.role) {
            case "upgrader":
                //roleUpgrader.run(creep);
                break;
            case "builder":
                //roleBuilder.run(creep);
                break;
            case "harvester":
            default:
                //roleHarvester.run(creep);
        }
    }
}