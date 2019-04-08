/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
let CreepClass = require('class.creep');

class BuilderRole extends CreepClass {

    /**
     * See: https://www.digitalocean.com/community/tutorials/understanding-classes-in-javascript#defining-methods
     */
    act() {
        console.log("Builder");
        if (this.creep.memory.building && this.creep.carry.energy == 0) {
            this.creep.memory.building = false;
            this.creep.say('🔄 harvest');
        }
        if (!this.creep.memory.building && this.creep.carry.energy == this.creep.carryCapacity) {
            this.creep.memory.building = true;
            this.creep.say('🚧 build');
        }

        if (this.creep.memory.building) {
            var targets = this.creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (this.creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
        else {
            var sources = this.creep.room.find(FIND_SOURCES);
            if (this.creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
}

module.exports = BuilderRole;