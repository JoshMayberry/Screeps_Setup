/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
//Use: https://github.com/screeps/tutorial-scripts/tree/master/section5

/*
 * Setup IDE
 * See: https://www.youtube.com/watch?v=edBMmOAfJ-Q
 * See: https://steamcommunity.com/sharedfiles/filedetails/?id=803169758
 * Use: https://steamcommunity.com/sharedfiles/filedetails/?id=1183135070
 * Use: https://steamcommunity.com/sharedfiles/filedetails/?id=1183135070#comment_content_1711815918575230079
 **/

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var spawner = require('spawner');

    
module.exports.loop = function () {
    spawner.spawn_creeps();
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        creep.h
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}