/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
let CreepClass = require('class.creep');
let constants = require('constants');

class HarvesterRole extends CreepClass {

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
        if (this.creep.carry.energy >= this.creep.carryCapacity) {
            return this.task_fullEnergyStart();
        }

        this.actOrMove(constants.ACTIVITY_HARVEST, FIND_SOURCES)
    }

    /**
     * Changes state transfer state.
     */
    task_fullEnergyStart() {
        super.task_fullEnergyStart();
        this.creep.say("⛽ Transfer");
    }

    /**
     * When energy is full, transfer it to whoever needs it.
     */
    task_fullEnergy() {
        if (this.creep.carry.energy <= 0) {
            return this.task_noEnergyStart();
        }

        this.transferOrMove(constants.ACTIVITY_TRANSFER_ENERGY)
    }
}

module.exports = HarvesterRole;