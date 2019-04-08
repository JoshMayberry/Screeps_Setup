﻿/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
let CreepClass = require('class.creep');
var constants = require('constants');

class BuilderRole extends CreepClass {

    /**
     * Changes state to harvesting state.
     */
    task_noEnergyStart() {
        super.task_noEnergyStart();
        this.creep.say('🔄 harvest');
    }

    /**
     * When there is no energy, harvest more.
     */
    task_noEnergy() {
        //console.log("@BuilderRole.task_noEnergy: " + this.creep.carry.energy);
        if (this.creep.carry.energy >= this.creep.carryCapacity) {
            return this.task_fullEnergyStart();
        }

        let destination = this.getDestination(FIND_SOURCES);
        //console.log("@BuilderRole.task_noEnergy_2: " + destination + "; " + this.creep.harvest(destination));
        switch (this.creep.harvest(destination)) {
            case ERR_NOT_IN_RANGE:
                this.moveTo(destination, constants.PATH_HARVEST)
                break;
            case OK:
                break;
            default:
                this.creep.memory.destinationId = null;
        }
    }

    /**
     * Changes state building state.
     */
    task_fullEnergyStart() {
        super.task_fullEnergyStart();
        this.creep.say('🚧 build');
    }

    /**
     * When energy is full, build a structure.
     */
    task_fullEnergy() {
        //console.log("@BuilderRole.task_fullEnergy: " + this.creep.carry.energy);
        if (this.creep.carry.energy <= 0) {
            return this.task_noEnergyStart();
        }

        let destination = this.getDestination(FIND_CONSTRUCTION_SITES);
        switch (this.creep.build(destination)) {
            case ERR_NOT_IN_RANGE:
                this.moveTo(destination, constants.PATH_BUILD)
                break;
            case OK:
                break;
            default:
                this.creep.memory.destinationId = null;
        }
    }
}

module.exports = BuilderRole;