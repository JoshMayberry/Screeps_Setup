var ActiveClass = require('class.active');

/**
 * The base class for a creep.
 * See: https://github.com/dmleach/scroops/blob/master/class.creep.js
 */
class CreepClass extends ActiveClass {
    constructor(creep) {
        super();
        this.creep = creep;
    }
}

module.exports = CreepClass;