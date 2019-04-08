/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
var ActiveClass = require('class.active');

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

    getParts() {
        return [Game.WORK, Game.CARRY, Game.MOVE];
    }
}

module.exports = CreepClass;