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

    endState() {
        switch (this.creep.memory.state) {
            case constants.ACTIVITY_BUILD:
                this.end_build()
                break;
            case constants.ACTIVITY_HARVEST:
                this.end_harvest()
                break;
        }
        this.creep.memory.destination = null;
    }

    /**
     * Changes state harvesting state.
     */
    start_harvest() {
        this.endState();
        this.creep.memory.state = constants.ACTIVITY_HARVEST;
        this.creep.say('🔄 harvest');
    }

    end_harvest() { }

    harvest() {
        if (this.creep.carry.energy >= this.creep.carryCapacity) {
            return this.start_build();
        }

        let destination = this.getDestination(FIND_SOURCES);

        switch (this.creep.harvest(destination)) {
            case ERR_NOT_IN_RANGE:
                this.moveTo(destination, constants.PATH_HARVEST)
                break;
            case OK:
                break;
            default:
                this.creep.memory.destination = null;
        }
    }

    /**
     * Changes state building state.
     */
    start_build() {
        this.endState();
        this.creep.memory.state = constants.ACTIVITY_BUILD;
        this.creep.say('🚧 build');
    }

    end_build() { }

    /**
     * Builds a structure.
     */
    build() {
        if (this.creep.carry.energy <= 0) {
            return this.start_harvest();
        }

        let destination = this.getDestination(FIND_CONSTRUCTION_SITES);
        switch (this.creep.build(destination)) {
            case ERR_NOT_IN_RANGE:
                this.moveTo(destination, constants.PATH_BUILD)
                break;
            case OK:
                break;
            default:
                this.creep.memory.destination = null;
        }
    }

}

module.exports = BuilderRole;