var ProfiledClass = require('class.profiled');

/**
  * Manages Creeps.
  * Use: https://github.com/dmleach/scroops/blob/master/helper.creep.js
  */
class CreepHelper extends ProfiledClass {
    /**
     * A list of creep classes
     * See: https://stackoverflow.com/questions/22528967/es6-class-variable-alternatives/25036137#25036137
     */
    static get catalogue_creepClasses() {
        return {
            builder: 'class.builder',
            harvester: 'class.harvester',
            upgrader: 'class.upgrader',
        }
    }

    static createCreepById(id) {
        let gameObject = Game.getObjectById(id);

        if (gameObject instanceof Creep) {
            return this.createCreepByName(gameObject.name);
        }
    }

    static createCreepByName(name) {
        let creep = Game.creeps[name];

        if (!creep) {
            throw new Error('Could not find creep with name ' + name);
        }

        let creepClass = this.getCreepClassByObject(creep);
        return new creepClass(creep);
    }

    /**
     * Returns the creep class to use for this creep.
     * @param {Creep} creep - What creep to get a class for
     * See: http://pietschsoft.com/post/2015/09/05/JavaScript-Basics-How-to-create-a-Dictionary-with-KeyValue-pairs#highlighter_173933
     * See: https://stackoverflow.com/questions/1098040/checking-if-a-key-exists-in-a-javascript-object/1098955#1098955
     */
    static getCreepClassByObject(creep) {
        let role = creep.memory.role;
        if (!(role in this.catalogue_creepClasses)) {
            throw new Error("Could not find class for creep with role " + role);
        }

        return require(this.catalogue_creepClasses[role]);
    }
}

module.exports = CreepHelper;
