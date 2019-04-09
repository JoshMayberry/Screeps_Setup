﻿/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
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
        console.log("@CreepClass.constructor " + creep);
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
        return [WORK, CARRY, MOVE];
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
        console.log("@main ", + this.creep);
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
    getDestination(activity, target) {
        console.log("@getDestination ", + this.creep);
        switch (activity) {
            case constants.ACTIVITY_UPGRADE:
                return target;
            default:
                let destinationId = this.creep.memory.destinationId;
                if (!destinationId || (destinationId == null)) {
                    var closest = this.creep.pos.findClosestByRange(target);
                    console.log("@getDestination_2 ", + this.creep);
                    this.creep.memory.destinationId = closest.id;
                    return closest
                }
                return Game.getObjectById(destinationId);
        }
    }

    getPathStroke() {
        switch (this.creep.memory.state) {
            case constants.TASK_NO_ENERGY:
                return constants.PATH_NO_ENERGY;
            case constants.TASK_FULL_ENERGY:
                return constants.PATH_FULL_ENERGY;
        }
        throw new Error("Unknown State " + this.creep.memory.state);
    }

    moveTo(destination) {
        this.creep.moveTo(destination, { visualizePathStyle: { stroke: this.getPathStroke() } });
    }

    actOrMove(activity, target) {
        var destination = this.getDestination(activity, target);
        var errorCode = null;
        switch (activity) {
            case constants.ACTIVITY_HARVEST:
                errorCode = this.creep.harvest(destination);
                break;
            case constants.ACTIVITY_BUILD:
                errorCode = this.creep.build(destination);
                break;
            case constants.ACTIVITY_TRANSFER_ENERGY:
                errorCode = this.creep.transfer(destination, RESOURCE_ENERGY);
                break;
            case constants.ACTIVITY_UPGRADE:
                errorCode = this.creep.upgradeController(destination);
                break;
        }

        switch (errorCode) {
            case ERR_NOT_IN_RANGE:
                this.moveTo(destination)
                break;
            case OK:
                break;
            default:
                this.creep.memory.destinationId = null;
        }
    }

    transferOrMove(activity) {
        var target = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
        if (target) {
            this.actOrMove(activity, target)
        }
    }
}

module.exports = CreepClass;