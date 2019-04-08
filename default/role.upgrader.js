﻿/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
let CreepClass = require('class.creep');
let constants = require('constants');

class UpgraderRole extends CreepClass {

    /**
     * See: https://www.digitalocean.com/community/tutorials/understanding-classes-in-javascript#defining-methods
     */
    main() {
        if (this.creep.memory.upgrading && this.creep.carry.energy == 0) {
            this.creep.memory.upgrading = false;
            this.creep.say('🔄 harvest');
        }
        if (!this.creep.memory.upgrading && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.upgrading = true;
            this.creep.say('⚡ upgrade');
        }

        if (this.creep.memory.upgrading) {
            if (this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(this.creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else {
            var sources = this.creep.room.find(FIND_SOURCES);
            if (this.creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }

    startHarvest() {
        this.creep.say('🔄 harvest');
    }
}

module.exports = UpgraderRole;