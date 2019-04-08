/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
let CreepClass = require('class.creep');

const ACTIVITY_HARVEST = 0;
const ACTIVITY_DEPOSIT = 1;

class HarvesterRole extends CreepClass {

    /**
     * See: https://www.digitalocean.com/community/tutorials/understanding-classes-in-javascript#defining-methods
     */
    act() {
        console.log("Harvester: " + this.creep);
        if (this.creep.carry.energy < this.creep.carryCapacity) {
            var sources = this.creep.room.find(FIND_SOURCES);
            if (this.creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        else {
            var targets = this.creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length > 0) {
                if (this.creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
}

module.exports = HarvesterRole;