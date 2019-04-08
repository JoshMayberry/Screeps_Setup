/*
 * Base Operations
 */

module.exports = {
    defend_base: function () {
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
    },
    
    spawn_creeps: function () {
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
    
        if(harvesters.length < 2) {
            var newName = 'Drone_' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            Game.spawns['Mother_Brain'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'harvester'}});
        }
        else if(upgraders.length < 1) {
            var newName = 'Upgrader_' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Mother_Brain'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'upgrader'}});
        }
        else if(builders.length < 1) {
            var newName = 'Builder_' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns['Mother_Brain'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'builder'}});
        } 
    
        if(Game.spawns['Mother_Brain'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['Mother_Brain'].spawning.name];
            Game.spawns['Mother_Brain'].room.visual.text('🛠️' + spawningCreep.memory.role, Game.spawns['Mother_Brain'].pos.x + 1, Game.spawns['Mother_Brain'].pos.y, {align: 'left', opacity: 0.8});
        }
    },
};