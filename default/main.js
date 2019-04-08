//Use: https://github.com/screeps/tutorial-scripts/tree/master/section5

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    // var tower = Game.getObjectById('TOWER_ID');
    // if(tower) {
    //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //         filter: (structure) => structure.hits < structure.hitsMax
    //     });
    //     if(closestDamagedStructure) {
    //         tower.repair(closestDamagedStructure);
    //     }

    //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //     if(closestHostile) {
    //         tower.attack(closestHostile);
    //     }
    // }
    
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var builders   = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders  = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 2) {
        var newName = 'Drone_' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Mother_Brain'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'harvester'}});
    }
    else if(upgraders.length < 1) {
        var newName = 'Upgrader_' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Mother_Brain'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'upgrader'}});
    }
    else if(builders.length < 1) {
        var newName = 'Builder_' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Mother_Brain'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'builder'}});
    } 

    if(Game.spawns['Mother_Brain'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Mother_Brain'].spawning.name];
        Game.spawns['Mother_Brain'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Mother_Brain'].pos.x + 1,
            Game.spawns['Mother_Brain'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}