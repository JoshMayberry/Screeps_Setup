/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
let CreepClass = require('class.creep');
let constants = require('constants');

class HarvesterRole extends CreepClass {

    /**
     * See: https://www.digitalocean.com/community/tutorials/understanding-classes-in-javascript#defining-methods
     */
    main() {
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
    //main() {
    //    switch (this.creep.memory.state) {
    //        case constants.ACTIVITY_DEPOSIT:
    //            this.deposit()
    //            break;
    //        case constants.ACTIVITY_HARVEST:
    //            this.harvest()
    //            break;
    //        default:
    //            this.start_harvest();
    //    }
    //}

    //endState() {
    //    switch (this.creep.memory.state) {
    //        case constants.ACTIVITY_DEPOSIT:
    //            this.end_desposit()
    //            break;
    //        case constants.ACTIVITY_HARVEST:
    //            this.end_harvest()
    //            break;
    //    }
    //    this.creep.memory.destination = null;
    //}

    ///**
    // * Changes state building state.
    // */
    //start_deposit() {
    //    this.endState();
    //    this.creep.memory.state = constants.ACTIVITY_DEPOSIT;
    //    this.creep.say('deposit');
    //}

    //end_desposit() { }

    ///**
    // * Deposits the energy.
    // */
    //deposit() {
    //    if (this.creep.carry.energy <= 0) {
    //        return this.start_harvest();
    //    }

    //    let destination = this.getDestination(FIND_CONSTRUCTION_SITES);

    //    switch (this.creep.build(destination)) {
    //        case ERR_NOT_IN_RANGE:
    //            this.moveTo(destination, constants.PATH_BUILD)
    //            break;
    //        case OK:
    //            break;
    //        default:
    //            this.creep.memory.destination = null;
    //    }
    //}
}

module.exports = HarvesterRole;