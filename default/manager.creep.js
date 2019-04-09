/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
var ProfiledClass = require('class.profiled');
var constants = require('constants');

/**
  * Manages Creeps.
  * See: https://github.com/Garethp/Screeps/blob/master/roleManager.js
  * Use: https://github.com/dmleach/scroops/blob/master/helper.creep.js
  */
class CreepManager extends ProfiledClass {
    static getCreepClassFileName(role) {
        switch (role) {
            case constants.ROLE_HARVESTER:
                return "role.harvester";
            case constants.ROLE_BUILDER:
                return "role.builder";
            case constants.ROLE_UPGRADER:
                return "role.upgrader";
            default:
                throw new Error("Unknown Role: " + role);
        }
    }

    static getCreepPriority(role) {
        switch (role) {
            case constants.ROLE_HARVESTER:
                return 5;
            case constants.ROLE_BUILDER:
                return 5;
            case constants.ROLE_UPGRADER:
                return 6;
            default:
                throw new Error("Unknown Role: " + role);
        }
    }

    static getCreepTargetQuantity(role) {
        switch (role) {
            case constants.ROLE_HARVESTER:
                return 3;
                break;
            case constants.ROLE_BUILDER:
                return 2;
                break;
            case constants.ROLE_UPGRADER:
                return 1;
                break;
            default:
                throw new Error("Unknown Role: " + role + "; " + [constants.ROLE_HARVESTER, constants.ROLE_BUILDER, constants.ROLE_UPGRADER]);
        }
    }

    static createCreepById(id) {
        let gameObject = Game.getObjectById(id);
        if (gameObject instanceof Creep) {
            return this.createCreepByName(gameObject.name);
        }
        throw new Error("Game object is not a creep: " + gameObject);
    }

    static createCreepByName(name) {
        let creep = Game.creeps[name];
        if (!creep) {
            throw new Error('Could not find creep with name ' + name);
        }

        let creepClass = this.getCreepClassByObject(creep);
        console.log("@createCreepByName " + creep);
        return new creepClass(creep);
    }

    static createCreepByObject(creep) {
        let creepClass = this.getCreepClassByObject(creep);
        console.log("@createCreepByObject " + creep);
        return new creepClass(creep);
    }

    static createCreepByRole(role, creep = 1) {
        let creepClass = this.getCreepClassByRole(role);
        console.log("@createCreepByRole " + creep);
        return new creepClass(creep);
    }

    static getCreepClassByObject(creep) {
        //switch (creep.memory.role) {
        //    case "harvester":
        //        creep.memory.role = constants.ROLE_HARVESTER;
        //        break;
        //    case "builder":
        //        creep.memory.role = constants.ROLE_BUILDER;
        //        break;
        //    case "upgrader":
        //        creep.memory.role = constants.ROLE_UPGRADER;
        //        break;
        //}

        return this.getCreepClassByRole(creep.memory.role);
    }

    /**
     * Returns the creep class to use for this role.
     */
    static getCreepClassByRole(role) {
        return require(this.getCreepClassFileName(role));
    }

    static getBodyPartCost(partList) {
        var cost = 0;
        for (var i = 0, l = partList.length; i < l; i++) {
            cost += BODYPART_COST[partList[i]]
        }
        return cost
    }

    static addToQueue(role) {
        var partList = this.createCreepByRole(role).getParts()
        var cost = this.getBodyPartCost(partList);
        if (cost > Game.spawns['Mother_Brain'].energyCapacity) {
            throw new Error("Cannot create creep that costs " + cost + " of " + Game.spawns['Mother_Brain'].energyCapacity);
        }

        Memory.creepQueue.push({
            "role": role,
            "priority": this.getCreepPriority(role),
            "partList": partList,
            "cost": cost,
        })

        ////TODO: Sort by priority
        //if (Memory.creepQueue.length > 1) {
        //    Memory.creepQueue = _.max(Memory.creepQueue, (item) => item.priority) This returns an item, not a sorted list
        //}
    }

    static spawn_creeps() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        //Memory.creepQueue = [];
        //See: https://stackoverflow.com/questions/5852299/how-to-prevent-values-from-being-converted-to-strings-in-javascript/5852316#5852316
        var roleList = new Array(constants.ROLE_HARVESTER, constants.ROLE_BUILDER, constants.ROLE_UPGRADER);
        for (var i = 0, l = roleList.length; i < l; i++) {
            var role = roleList[i];
            var creepList = _.filter(Game.creeps, (creep) => creep.memory.role == role);
            var targetQuantity = this.getCreepTargetQuantity(role);

            if (creepList.length < targetQuantity) {
                //var queueList = Memory.creepQueue;
                var queueList = _.filter(Memory.creepQueue, (item) => item.role == role); //TO DO: This does not work
                if (creepList.length + queueList.length < targetQuantity) {
                    this.addToQueue(role)
                }
            }
        }

        var spawn = Game.spawns['Mother_Brain'];
        if (Memory.creepQueue.length >= 1) {
            var nextItem = Memory.creepQueue[0]
            if (nextItem.cost <= spawn.energy) {
                var newName = 'Drone_' + Game.time;
                console.log("Spawing creep: " + newName);
                spawn.spawnCreep(nextItem.partList, newName, { memory: { role: nextItem.role } });
            }
        }
    
        if (spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text('🛠️' + this.getCreepClassFileName(spawningCreep.memory.role), spawn.pos.x + 1, spawn.pos.y, {align: 'left', opacity: 0.8});
        }
    }

    static main() {
        this.spawn_creeps();

        try {
            for (let creepName in Game.creeps) {
                let creep = this.createCreepByName(creepName);
                console.log('main_2:', creep.creep);
                creep.main();
            }
        } catch (error) {
            console.log("Error: " + error + "\n" + error.stack);
        }
    }
}

module.exports = CreepManager;
