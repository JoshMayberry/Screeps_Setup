/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
//Use: https://github.com/screeps/tutorial-scripts/tree/master/section5

/*
 * Setup IDE
 * See: https://www.youtube.com/watch?v=edBMmOAfJ-Q
 * See: https://steamcommunity.com/sharedfiles/filedetails/?id=803169758
 * Use: https://steamcommunity.com/sharedfiles/filedetails/?id=1183135070
 * Use: https://steamcommunity.com/sharedfiles/filedetails/?id=1183135070#comment_content_1711815918575230079
 **/

var creepClass = require('class.creep');
var spawnerClass = require('class.spawner');
var basePlannerClass = require('class.basePlanner');

module.exports.loop = function () {
    try {
        for (let creepName in Game.creeps) {
            creepClass.main(Game.creeps[creepName]);
        }
    } catch (error) {
        console.log("@main; Error: " + error + "\n" + error.stack);
    }

    try {
        spawnerClass.main();
    } catch (error) {
        console.log("@main; Error: " + error + "\n" + error.stack);
    }

    try {
        basePlannerClass.main();
    } catch (error) {
        console.log("@main; Error: " + error + "\n" + error.stack);
    }
}