/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
var ActiveClass = require('class.active');
var constants = require('constants');

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

    //Abstract Methods - Replace these with new ones
    //See: https://medium.com/@yuribett/javascript-abstract-method-with-es6-5dbea4b00027
    task_noEnergy() {
        throw new Error("task_noEnergy() not implemented");
    }

    task_fullEnergy() {
        throw new Error("task_fullEnergy() not implemented");
    }

    //Super Methods - Run this, then your own code
    task_noEnergyStart() {
        this.endState();
        this.creep.memory.state = constants.TASK_NO_ENERGY;
    }

    task_fullEnergyStart() {
        this.endState();
        this.creep.memory.state = constants.TASK_FULL_ENERGY;
    }

    task_noEnergyEnd() {
    }

    task_fullEnergyEnd() {
    }

    //Overrideable Methods - Replace these if non-default output is desired
    getParts() {
        return [Game.WORK, Game.CARRY, Game.MOVE];
    }

    endState() {
        switch (this.creep.memory.state) {
            case constants.TASK_NO_ENERGY:
                this.task_noEnergyEnd()
                break;
            case constants.TASK_FULL_ENERGY:
                this.task_fullEnergyEnd()
                break;
        }
        this.creep.memory.destination = null;
    }

    main() {
        switch (this.creep.memory.state) {
            case constants.TASK_NO_ENERGY:
                this.task_noEnergy()
                break;
            case constants.TASK_FULL_ENERGY:
                this.task_fullEnergy()
                break;
            default:
                this.task_noEnergyStart();
        }
    }

    //Utility Methods - Do not override these
    getClosest(target) {
        var targetList = this.creep.room.find(target);
        console.log(targetList);
        return targetList[0];
    }

    getDestination(target) {
        let destinationId = this.creep.memory.destinationId;
        //destinationId = null;
        if (!destinationId || (destinationId == null)) {
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