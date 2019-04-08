/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
var ActiveClass = require('class.active');

/**
 * The base class for a creep.
 * See: https://github.com/dmleach/scroops/blob/master/class.creep.js
 * See: https://github.com/Garethp/Screeps/blob/master/role_prototype.js
 */
class CreepClass extends ActiveClass {

    constructor(creep) {
        super();
        this.creep = creep;
    }

    getParts() {
        return [Game.WORK, Game.CARRY, Game.MOVE];
    }

    getClosest(target) {
        var targetList = this.creep.room.find(target);
        console.log(targetList);
        return targetList[0];
    }

    getDestination(target) {
        let destinationId = this.creep.memory.destinationId;
        //destinationId = null;
        if (!destinationId) {
            let closest = this.getClosest(target);
            this.creep.memory.destinationId = closest.id;
            return closest
        }
        return Game.getObjectById(destinationId);
    }

    moveTo(destination, stroke) {
        this.creep.moveTo(destination, { visualizePathStyle: { stroke: stroke } });
    }
}

module.exports = CreepClass;