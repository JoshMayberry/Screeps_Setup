/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
let CreepClass = require('class.creep');
var constants = require('constants');

class BuilderRole extends CreepClass {

    /**
     * See: https://www.digitalocean.com/community/tutorials/understanding-classes-in-javascript#defining-methods
     */
    main() {
        switch (this.creep.memory.state) {
            case constants.ACTIVITY_BUILD:
                this.build()
                break;
            case constants.ACTIVITY_HARVEST:
                this.harvest()
                break;
            default:
                this.start_harvest();
        }
    }

    start_harvest() {
        this.creep.memory.state = constants.ACTIVITY_HARVEST;
        this.creep.say('🔄 harvest');
    }

    harvest() {
        if (this.creep.carry.energy >= this.creep.carryCapacity) {
            return this.start_build();
        }

        var sources = this.creep.room.find(FIND_SOURCES);
        if (this.creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            this.creep.moveTo(sources[0], { visualizePathStyle: { stroke: constants.PATH_HARVEST } });
        }
    }

    end_harvest() { }

    start_build() {
        this.creep.memory.state = constants.ACTIVITY_BUILD;
        this.creep.say('🚧 build');
    }

    build() {
        if (this.creep.carry.energy <= 0) {
            return this.start_harvest();
        }

        var targets = this.creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (this.creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(targets[0], { visualizePathStyle: { stroke: constants.PATH_BUILD } });
            }
        }
    }

    end_build() { }
}

module.exports = BuilderRole;