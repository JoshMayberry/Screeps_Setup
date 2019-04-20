/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
var constants = require('constants');
var creepClass = require('class.creep');

/**
  * Manages Creeps.
  * See: https://github.com/Garethp/Screeps/blob/master/roleManager.js
  * Use: https://github.com/dmleach/scroops/blob/master/helper.creep.js
  */
class SpawnerClass {
    static get spawnerName() {
        return "Spawn1";
    }

    static main() {
        try {
            this.spawn_creeps();
        } catch (error) {
            console.log("@SpawnerClass; Error: " + error + "\n" + error.stack);
        }
    }

    static getBodyPartCost(partList) {
        var cost = 0;
        for (var i = 0, l = partList.length; i < l; i++) {
            cost += BODYPART_COST[partList[i]]
        }
        return cost;
    }

    //Use: https://stackoverflow.com/questions/30324353/screeps-memory-adding-how/30399398#30399398
    static addToQueue(spawner, role) {
        //Prepare queue item
        var partList = creepClass.getParts(role)
        var cost = this.getBodyPartCost(partList);
        if (cost > spawner.energyCapacity) {
            throw new Error("Cannot create creep that costs " + cost + " of " + spawner.energyCapacity);
        }

        //Add queue item
        console.log("Adding: " + role);
        spawner.room.memory.creepQueue.push({
            "role": role,
            "priority": creepClass.getPriority(role),
            "partList": partList,
            "cost": cost,
        })

        ////TODO: Sort by priority
        //if (Memory.creepQueue.length > 1) {
        //    Memory.creepQueue = _.max(Memory.creepQueue, (item) => item.priority) This returns an item, not a sorted list
        //}
    }

    static spawn_creeps() {
        //Check for dead creeps
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        var spawner = Game.spawns[this.spawnerName];
        if (!spawner.room.memory.creepQueue) {
            spawner.room.memory.creepQueue = [];
        }

        //Queue more creeps (Consider doing this upon death and bypass checks)
        //See: https://stackoverflow.com/questions/5852299/how-to-prevent-values-from-being-converted-to-strings-in-javascript/5852316#5852316
        for (var i = 0, l = constants.roleList.length; i < l; i++) {
            //Does a new creep with that role need to be made?
            var role = constants.roleList[i];
            var creepList = _.filter(Game.creeps, (creep) => creep.memory.role == role);
            var targetQuantity = creepClass.getTargetQuantity(role);

            if (creepList.length < targetQuantity) {
                //Are there already enough in the queue?
                var queueList = _.filter(spawner.room.memory.creepQueue, (item) => item.role == role);
                if (creepList.length + queueList.length < targetQuantity) {
                    this.addToQueue(spawner, role);
                }
            }
        }

        if (spawner.room.memory.creepQueue.length >= 1) {
            var nextItem = _.max(spawner.room.memory.creepQueue, (item) => item.priority)
            if (nextItem.cost <= spawner.energy) {
                var newName = creepClass.getNewName(nextItem.role);
                console.log("Spawing creep: " + newName + "; " + nextItem.role);
                spawner.spawnCreep(nextItem.partList, newName, {
                    memory: {
                        role: nextItem.role,
                        state: constants.TASK_NO_ENERGY,
                    }
                });
            }
        }

        if (spawner.spawning) {
            var spawningCreep = Game.creeps[spawner.spawning.name];
            spawner.room.visual.text('🛠️' + creepClass.getRoleName(spawningCreep.memory.role), spawner.pos.x + 1, spawner.pos.y, { align: 'left', opacity: 0.8 });
        }
    }
}

module.exports = SpawnerClass;