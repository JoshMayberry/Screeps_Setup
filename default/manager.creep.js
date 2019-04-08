/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
var ProfiledClass = require('class.profiled');

/**
  * Manages Creeps.
  * See: https://github.com/Garethp/Screeps/blob/master/roleManager.js
  * Use: https://github.com/dmleach/scroops/blob/master/helper.creep.js
  */
class CreepManager extends ProfiledClass {
    /**
     * A list of creep classes
     * See: https://stackoverflow.com/questions/22528967/es6-class-variable-alternatives/25036137#25036137
     */
    static get catalogue_creepClasses() {
        return {
            builder: 'role.builder',
            harvester: 'role.harvester',
            upgrader: 'role.upgrader',
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
        if (!role) {
            role = "harvester";
            creep.memory.role = role;
        }
        if (!(role in this.catalogue_creepClasses)) {
            throw new Error("Could not find class for creep with role " + role);
        }

        return require(this.catalogue_creepClasses[role]);
    }

    static spawn_creeps() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    
        var builders   = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders  = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        // console.log('Harvesters: ' + harvesters.length);
    
        //if(harvesters.length < 2) {
        //    var newName = 'Drone_' + Game.time;
        //    console.log('Spawning new harvester: ' + newName);
        //    Game.spawns['Mother_Brain'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'harvester'}});
        //}
        if(upgraders.length < 1) {
            var newName = 'Upgrader_' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Mother_Brain'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'upgrader'}});
        }
        else if(builders.length < 4) {
            var newName = 'Builder_' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns['Mother_Brain'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'builder'}});
        } 
    
        if(Game.spawns['Mother_Brain'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['Mother_Brain'].spawning.name];
            Game.spawns['Mother_Brain'].room.visual.text('🛠️' + spawningCreep.memory.role, Game.spawns['Mother_Brain'].pos.x + 1, Game.spawns['Mother_Brain'].pos.y, {align: 'left', opacity: 0.8});
        }
    }

    static main() {
        this.spawn_creeps();

        try {
            for (let creepName in Game.creeps) {
                let creep = this.createCreepByName(creepName);
                creep.main();
            }
        } catch (error) {
            console.log("Error: " + error + "\n" + error.stack);
        }
    }
}

module.exports = CreepManager;
