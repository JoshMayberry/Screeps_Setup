/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
var constants = require('constants');

/**
 * The base class for a creep.
 * See: https://github.com/dmleach/scroops/blob/master/class.creep.js
 * See: https://github.com/Garethp/Screeps/blob/master/role_prototype.js
 */
class CreepClass {
	static main(creep) {
		try {
			//Check Job board
			if (creep.memory.role != constants.ROLE_PIONEER) {
				var numberOfCreeps = Object.keys(Game.creeps).length;
				if (numberOfCreeps <= 2) {
					creep.say("Pioneer!");
					creep.memory.role = constants.ROLE_PIONEER;
				}
			}

			//Do Job
			switch (creep.memory.state) {
				case constants.TASK_NO_ENERGY:
					this.task_noEnergy(creep);
					break;
				case constants.TASK_FULL_ENERGY:
					this.task_fullEnergy(creep);
					break;
				default:
					this.task_noEnergyStart(creep);
			}
		} catch (error) {
			console.log("@CreepClass; Error: " + error + "\n" + error.stack);
		}
	}

	//Routines
	static task_noEnergy(creep) {
		if (creep.carry.energy >= creep.carryCapacity) {
			return this.task_fullEnergyStart(creep);
		}

		switch (creep.memory.role) {
			case constants.ROLE_PIONEER:
				this.actOrMove(creep, constants.ACTIVITY_HARVEST, FIND_SOURCES);
				break;
			case constants.ROLE_HARVESTER:
				this.actOrMove(creep, constants.ACTIVITY_HARVEST, FIND_SOURCES);
				break;
			case constants.ROLE_BUILDER:
				this.actOrMove(creep, constants.ACTIVITY_HARVEST, FIND_SOURCES);
				break;
			case constants.ROLE_UPGRADER:
				this.actOrMove(creep, constants.ACTIVITY_HARVEST, FIND_SOURCES);
				break;
			default:
				throw new Error("Unknown Role: " + role);
		}
	}

	static task_fullEnergy(creep) {
		if (creep.carry.energy <= 0) {
			return this.task_noEnergyStart(creep);
		}

		switch (creep.memory.role) {
			case constants.ROLE_PIONEER:
				if ((creep.room.controller.level == 0) || (creep.room.controller.ticksToDowngrade < 1000)) {
					console.log("test");
					this.actOrMove(creep, constants.ACTIVITY_UPGRADE, creep.room.controller);
					break;
				}
			case constants.ROLE_HARVESTER:
				var possibleTargetList = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER];
				var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (structure) => {
						return (possibleTargetList.includes(structure.structureType) && (structure.energy < structure.energyCapacity));
					}
				});
				if (target) {
					this.actOrMove(creep, constants.ACTIVITY_TRANSFER_ENERGY, target);
				} else {
					this.energyWithNoDestination(creep);
				}
				break;
			case constants.ROLE_BUILDER:
				this.actOrMove(creep, constants.ACTIVITY_BUILD, FIND_CONSTRUCTION_SITES);
				break;
			case constants.ROLE_UPGRADER:
				this.actOrMove(creep, constants.ACTIVITY_UPGRADE, creep.room.controller);
				break;
			default:
				throw new Error("Unknown Role: " + role);
		}
	}

	//Start Routines
	static task_noEnergyStart(creep) {
		this.endState(creep);
		creep.memory.state = constants.TASK_NO_ENERGY;

		switch (creep.memory.role) {
			case constants.ROLE_PIONEER:
			case constants.ROLE_HARVESTER:
			case constants.ROLE_BUILDER:
			case constants.ROLE_UPGRADER:
				creep.say('🔄 harvest');
				break;
			default:
				throw new Error("Unknown Role: " + role);
		}
	}

	static task_fullEnergyStart(creep) {
		this.endState(creep);
		creep.memory.state = constants.TASK_FULL_ENERGY;
		
		switch (creep.memory.role) {
			case constants.ROLE_PIONEER:
				creep.say("⛽ Transfer");
				break;
			case constants.ROLE_HARVESTER:
				creep.say("⛽ Transfer");
				break;
			case constants.ROLE_BUILDER:
				creep.say('🚧 build');
				break;
			case constants.ROLE_UPGRADER:
				creep.say('⚡ upgrade');
				break;
			default:
				throw new Error("Unknown Role: " + role);
		}
	}

	//End Routines
	static task_noEnergyEnd(creep) {
		switch (creep.memory.role) {
			case constants.ROLE_PIONEER:
			case constants.ROLE_HARVESTER:
			case constants.ROLE_BUILDER:
			case constants.ROLE_UPGRADER:
				break;
			default:
				throw new Error("Unknown Role: " + role);
		}
	}

	static task_fullEnergyEnd(creep) {
		switch (creep.memory.role) {
			case constants.ROLE_PIONEER:
				//Should I stop pioneering?
				var numberOfCreeps = Object.keys(Game.creeps).length;
				if (numberOfCreeps > 2) {
					creep.say("No Pioneer");
					creep.memory.role = constants.ROLE_HARVESTER;
				}
				break;
			case constants.ROLE_HARVESTER:
			case constants.ROLE_BUILDER:
			case constants.ROLE_UPGRADER:
				break;
			default:
				throw new Error("Unknown Role: " + role);
		}
	}

	static endState(creep) {
		switch (creep.memory.state) {
			case constants.TASK_NO_ENERGY:
				this.task_noEnergyEnd(creep);
				break;
			case constants.TASK_FULL_ENERGY:
				this.task_fullEnergyEnd(creep);
				break;
			default:
				creep.memory.state = constants.TASK_NO_ENERGY;
				//throw new Error("Unknown Task: " + creep.memory.state);
		}
	}

	//Properties
	static getRoleName(role) {
		switch (role) {
			case constants.ROLE_PIONEER:
				return "pioneer";
			case constants.ROLE_HARVESTER:
				return "harvester";
			case constants.ROLE_BUILDER:
				return "builder";
			case constants.ROLE_UPGRADER:
				return "upgrader";
			default:
				throw new Error("Unknown Role: " + role);
		}
	}

	static getParts(role) {
		switch (role) {
			case constants.ROLE_PIONEER:
			case constants.ROLE_HARVESTER:
			case constants.ROLE_BUILDER:
			case constants.ROLE_UPGRADER:
				return [WORK, CARRY, MOVE, MOVE, MOVE];
			default:
				throw new Error("Unknown Role: " + role);
		}
	}

	static getPriority(role) {
		switch (role) {
			case constants.ROLE_PIONEER:
				return 0;
			case constants.ROLE_HARVESTER:
				return 6;
			case constants.ROLE_BUILDER:
				return 4;
			case constants.ROLE_UPGRADER:
				return 5;
			default:
				throw new Error("Unknown Role: " + role);
		}
	}

	static getTargetQuantity(role) {
		switch (role) {
			case constants.ROLE_PIONEER:
				return 0;
			case constants.ROLE_HARVESTER:
				return 2;
			case constants.ROLE_BUILDER:
				return 2;
			case constants.ROLE_UPGRADER:
				return 1;
			default:
				throw new Error("Unknown Role: " + role);
		}
	}

	static getNewName(role) {
		switch (role) {
			case constants.ROLE_PIONEER:
			case constants.ROLE_HARVESTER:
			case constants.ROLE_BUILDER:
			case constants.ROLE_UPGRADER:
				return 'Drone_' + this.getRoleName(role) + "_" + Game.time;
			default:
				throw new Error("Unknown Role: " + role);
		}
	}

	//Utility Methods
	static getDestination(creep, activity, target) {
		switch (activity) {
			case constants.ACTIVITY_TRANSFER_ENERGY:
			case constants.ACTIVITY_UPGRADE:
				return target;
			default:
				return creep.pos.findClosestByRange(target)
		}
	}

	static getPathStroke(creep) {
		switch (creep.memory.state) {
			case constants.TASK_NO_ENERGY:
				return constants.PATH_NO_ENERGY;
			case constants.TASK_FULL_ENERGY:
				return constants.PATH_FULL_ENERGY;
		}
		throw new Error("Unknown State " + creep.memory.state);
	}

	static moveTo(creep, destination) {
		creep.moveTo(destination, { visualizePathStyle: { stroke: this.getPathStroke(creep) } });
	}

	static actOrMove(creep, activity, target) {
		var destination = this.getDestination(creep, activity, target);
		var errorCode = null;
		switch (activity) {
			case constants.ACTIVITY_HARVEST:
				errorCode = creep.harvest(destination);
				break;
			case constants.ACTIVITY_BUILD:
				errorCode = creep.build(destination);

				//If there are no build sites, repair something instead
				switch (errorCode) {
					case ERR_INVALID_TARGET:
						this.energyWithNoDestination(creep);
						break;
				}
				break;
			case constants.ACTIVITY_TRANSFER_ENERGY:
				errorCode = creep.transfer(destination, RESOURCE_ENERGY);
				break;
			case constants.ACTIVITY_UPGRADE:
				errorCode = creep.upgradeController(destination);
				switch (errorCode) {
					case ERR_NOT_OWNER:
						creep.say("⚠ Claim!")
				}
				break;
		}

		console.log(errorCode);
		switch (errorCode) {
			case ERR_NOT_IN_RANGE:
				this.moveTo(creep, destination);
				break;
			case OK:
				break;
			default:
				this.energyWithNoDestination(creep);
		}
	}

	static energyWithNoDestination(creep) {
		////Move off the road if you are standing on one
		//const look = creep.pos.look();
		//look.forEach(function (lookObject) {
		//    if (lookObject.type == LOOK_STRUCTURES) {
		//        console.log("@3; " + lookObject.structure.structureType + "; " + STRUCTURE_ROAD + "; " + (lookObject.structure.structureType == STRUCTURE_ROAD));
		//    }
		//});

		//Move to the idle flag
		var target = Game.flags.IdleFlag;
		if (!target) {
			var spawnerClass = require('class.spawner');
			var spawner = Game.spawns[spawnerClass.spawnerName];
			target = new RoomPosition(spawner.pos.x - 3, spawner.pos.y - 3, spawner.pos.roomName).createFlag("IdleFlag");
		}

		this.moveTo(creep, target)
	}
}

module.exports = CreepClass;