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
			if (creep.ticksToLive >= 1500) {
				this.justBorn(creep);
			}
			switch (creep.memory.state) {
				case constants.TASK_NO_ENERGY:
					this.task_noEnergy(creep);
					break;
				case constants.TASK_NEW_ENERGY:
					this.task_newEnergy(creep);
					break;
				case constants.TASK_FULL_ENERGY:
					this.task_fullEnergy(creep);
					break;
				case constants.TASK_PATROL:
					this.task_patrol(creep);
					break;
				default:
					this.task_noEnergyStart(creep);
			}
		} catch (error) {
			console.log("@CreepClass; Error: " + error + "\n" + error.stack);
		}
	}

	static justBorn(creep) {
		this.task_newEnergyStart(creep);
	}

	//Routines
	static task_noEnergy(creep) {
		if (creep.carry.energy >= creep.carryCapacity) {
			return this.task_fullEnergyStart(creep);
		}

		//Quick job board check
		this.checkJobBoard(creep);

		switch (creep.memory.role) {
			case constants.ROLE_SOLDIER:
				this.task_patrolStart(creep);
				break;
			case constants.ROLE_PIONEER:
			case constants.ROLE_HARVESTER:
			case constants.ROLE_BUILDER:
			case constants.ROLE_UPGRADER:
				this.actOrMove(creep, constants.ACTIVITY_HARVEST);
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
			case constants.ROLE_SOLDIER:
				return this.task_patrolStart(creep);
			case constants.ROLE_PIONEER:
				if ((creep.room.controller.level == 0) || (creep.room.controller.ticksToDowngrade < 1000)) {
					this.actOrMove(creep, constants.ACTIVITY_UPGRADE, creep.room.controller);
					break;
				}
			case constants.ROLE_HARVESTER:
				var target = this.getCurrentEnergyTarget(creep);
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

	static task_newEnergy(creep) {
		var destination = this.getCurrentEnergyTarget(creep);
		switch (creep.memory.role) {
			case constants.ROLE_SOLDIER:
				return this.task_patrolStart(creep);
			case constants.ROLE_PIONEER:
			case constants.ROLE_HARVESTER:
			case constants.ROLE_BUILDER:
			case constants.ROLE_UPGRADER:
				if (creep.pos.getRangeTo(destination) > 8) {
					//Get closer to destination
					return this.moveTo(creep, destination);
				}

				//Find out how many subscribers each source has
				var subscribedSources = new Map();
				for (let creepName in Game.creeps) {
					var key = Game.creeps[creepName].memory.energySource;
					if (key == undefined) {
						continue
					}
					if (!subscribedSources.has(key)) {
						subscribedSources.set(key, 1)
					} else {
						subscribedSources.set(key, 1 + subscribedSources.get(key))
					}
				}

				//Find an available source; if not enough are available, try overloading them up to 1.5 times as much creeps
				var source = null;
				for (let overload = 1; overload <= 1.5; overload += 0.5) {
					source = this.getClosestSource(creep, subscribedSources, overload);
					if (source != null) {
						break;
					}
				}
				if (source != null) {
					creep.memory.energySource = source.id;
				} else {
					console.log("@2", creep.memory.role)
					//Still no room left, so become a soldier
					if (creep.getActiveBodyparts(ATTACK) < 0) {
						if (room.memory.soldiersNeeded == undefined) {
							room.memory.soldiersNeeded = 1;
						} else {
							room.memory.soldiersNeeded += 1;
						}
						console.log("A soldier must be created")
						return creep.suicide();
					}
					creep.memory.role = constants.ROLE_SOLDIER;
				}

				this.endState(creep);
				break;
			default:
				throw new Error("Unknown Role: " + role);
		}
	}

	//See: https://github.com/Garethp/Screeps/blob/master/roles_guard.js
	//See: https://github.com/Garethp/Screeps/blob/master/roles_archer.js
	static task_patrol(creep) {
		var targets = this.getEnemies(creep, -1, null, function(enemy) {
			//Is this creep too strong?
			if (enemy.getActiveBodyparts(RANGED_ATTACK) > creep.getActiveBodyparts(RANGED_ATTACK)) {
				return false;
			}
			return enemy.getActiveBodyparts(ATTACK) > creep.getActiveBodyparts(ATTACK)
		});
		if (targets.length) {
			creep.moveTo(targets[0]);
			creep.attack(targets[0]);
		}
		else {
			this.energyWithNoDestination(creep);
		}
	}

	//Start Routines
	static task_noEnergyStart(creep) {
		this.endState(creep);
		creep.memory.state = constants.TASK_NO_ENERGY;

		switch (creep.memory.role) {
			case constants.ROLE_SOLDIER:
				return this.task_patrolStart(creep);
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

	static task_newEnergyStart(creep) {
		this.endState(creep);
		creep.memory.state = constants.TASK_NEW_ENERGY;

		switch (creep.memory.role) {
			case constants.ROLE_SOLDIER:
				creep.memory.energySource = null;
				return this.task_patrolStart(creep);
			case constants.ROLE_PIONEER:
			case constants.ROLE_HARVESTER:
			case constants.ROLE_BUILDER:
			case constants.ROLE_UPGRADER:
			creep.say('⚙ Setup');
				break;
			default:
				throw new Error("Unknown Role: " + role);
		}
	}

	static task_fullEnergyStart(creep) {
		this.endState(creep);
		creep.memory.state = constants.TASK_FULL_ENERGY;
		
		switch (creep.memory.role) {
			case constants.ROLE_SOLDIER:
				return this.task_patrolStart(creep);
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

	static task_patrolStart(creep) {
		console.log("@8", creep.memory.state)
		this.endState(creep);
		creep.memory.state = constants.TASK_PATROL;
		creep.say("⛨ Patrol");
	}

	//End Routines
	static task_noEnergyEnd(creep) {
		switch (creep.memory.role) {
			case constants.ROLE_SOLDIER:
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
			case constants.ROLE_SOLDIER:
			case constants.ROLE_PIONEER:
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
			case constants.ROLE_SOLDIER:
				return "soldier";
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

	static getBodyPartCost(partList) {
		var cost = 0;
		for (var i = 0, l = partList.length; i < l; i++) {
			cost += BODYPART_COST[partList[i]]
		}
		return cost;
	}

	static getParts(role) {
		switch (role) {
			case constants.ROLE_SOLDIER:
				return [TOUGH, ATTACK, ATTACK, MOVE, HEAL]
			case constants.ROLE_PIONEER:
			case constants.ROLE_HARVESTER:
			case constants.ROLE_BUILDER:
			case constants.ROLE_UPGRADER:
				return [WORK, CARRY, MOVE, MOVE, MOVE];
			default:
				throw new Error("Unknown Role: " + role);
		}
	}

	//Higher: More important
	static getPriority(role) {
		switch (role) {
			case constants.ROLE_SOLDIER:
				return 8;
			case constants.ROLE_PIONEER:
				return 9;
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
			case constants.ROLE_SOLDIER:
				var quantity = Memory.soldiersNeeded;
				if (quantity == undefined) {
					return 0;
				}
				return quantity;
			case constants.ROLE_PIONEER:
				if (Object.keys(Game.creeps).length <= 2) {
					return 2;
				}
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
			case constants.ROLE_SOLDIER:
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
				// console.log("@1");
				return creep.pos.findClosestByRange(target)
		}
	}

	static getClosestSource(creep, subscribedSources = null, overload = 1) {
		if (subscribedSources == null) {
			//Find out how many subscribers each source has
			subscribedSources = new Map();
			for (let creepName in Game.creeps) {
				var key = Game.creeps[creepName].memory.energySource;
				if (key == undefined) {
					continue
				}
				if (!subscribedSources.has(key)) {
					subscribedSources.set(key, 1)
				} else {
					subscribedSources.set(key, 1 + subscribedSources.get(key))
				}
			}
		}

		var root = this;
		return creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {
			filter: (source) => {
				//Does that source have too many subscribers?
				var subscriberCount = subscribedSources.get(source.id)
				if ((subscriberCount != undefined) && (root.getEmptySpaces(source) * overload <= subscriberCount)) {
					return false;
				}

				//Are there any enemies it?
				if (root.getEnemies(source, 2).length > 0) {
					return false;
				}

				//Should be safe to use then
				return true;
			}
		});
	}

	//Use: https://screeps.com/forum/topic/819/code-snippet-get-possible-connections-for-source/9#6
	//See: https://docs.screeps.com/contributed/modifying-prototypes.html#Source-freeSpaceCount-How-many-creeps-can-you-fit-near-that-source
	static getEmptySpaces(item, radius = 1) {
		var fields = item.room.lookForAtArea(LOOK_TERRAIN, item.pos.y - radius, item.pos.x - radius, item.pos.y + radius, item.pos.x + radius, true);
		return 9 - _.countBy( fields , "terrain" ).wall;
	}

	//radius: How many blocks from the origin to look
	//	- If null: looks at the entire room
	//armed: If the enemy has any attack parts
	//	- If true: Must have attack parts
	//	- If false: Must not have attack parts
	//	- If null: Attack parts do not matter
	//extraFunction: An extra check function to run; must take 1 argument for the creep
	//	- If returns null: Does other checks
	//	- If returns true: Adds the creep to the list
	//	- If returns false: Does not add the creep to the list
	static getEnemies(item, radius = 1, armed = true, extraFunction = null) {
		var enemies = new Array();

		if (radius < 0) {
			enemies = item.room.find(FIND_HOSTILE_CREEPS, {
				filter: function(creep) {
					if (extraFunction != null) {
						var answer = extraFunction(creep)
						if (answer != null) {
							return answer
						}
					}
					if (armed == null) {
						return true;
					} else if (armed) {
						return (creep.getActiveBodyparts(ATTACK) > 0) || (creep.getActiveBodyparts(RANGED_ATTACK) > 0);
					} else {
						return (creep.getActiveBodyparts(ATTACK) <= 0) && (creep.getActiveBodyparts(RANGED_ATTACK) <= 0);
					}
				}
			});
		} else {
			item.room.lookForAtArea(LOOK_CREEPS, item.pos.y - radius, item.pos.x - radius, item.pos.y + radius, item.pos.x + radius, true).forEach(function(lookObject) {
				var creep = lookObject.creep;
				if (extraFunction != null) {
					answer = extraFunction(creep)
					if (answer != null) {
						if (answer) {
							enemies.push(creep);
						} else {
							return;
						}
					}
				}
				if (armed == null) {
					if (!creep.my) {
						enemies.push(creep);
					}
				} else if (armed) {
					if ((!creep.my) && ((creep.getActiveBodyparts(ATTACK) > 0) || (creep.getActiveBodyparts(RANGED_ATTACK) > 0))) {
						enemies.push(creep);
					}
				} else {
					if ((!creep.my) && ((creep.getActiveBodyparts(ATTACK) <= 0) && (creep.getActiveBodyparts(RANGED_ATTACK) <= 0))) {
						enemies.push(creep);
					}
				}
			});
		}
		return enemies;
	}

	static getPathStroke(creep) {
		switch (creep.memory.state) {
			case constants.TASK_NO_ENERGY:
				return constants.PATH_NO_ENERGY;
			case constants.TASK_NEW_ENERGY:
				return constants.PATH_NEW_ENERGY;
			case constants.TASK_FULL_ENERGY:
				return constants.PATH_FULL_ENERGY;
			case constants.TASK_PATROL:
				return constants.PATH_PATROL;
		}
		throw new Error("Unknown State " + creep.memory.state);
	}

	static getCurrentEnergyTarget(creep) {
		switch (creep.memory.role) {
			case constants.ROLE_SOLDIER:
				return null;

			case constants.ROLE_UPGRADER:
				return creep.room.controller;

			case constants.ROLE_BUILDER:
				return creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

			case constants.ROLE_PIONEER:
			case constants.ROLE_HARVESTER:
				var possibleTargetList = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER];
				return creep.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (structure) => {
						return (possibleTargetList.includes(structure.structureType) && (structure.energy < structure.energyCapacity));
					}
				});

			default:
				throw new Error("Unknown Role: " + role);
		}
	}

	//Use: https://screeps.com/forum/topic/1781/get-number-of-creeps-with-x-role/5
	static getNumberOfRole(targetRole) {
		return _(Memory.creeps).filter({role: targetRole}).size();
	}

	//Use: https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
	static getNeededRole(creep = null, overload = 1) {
		var root = this;
		var targetRole = null;
		constants.roleList.sort((a, b) => (this.getPriority(a) < this.getPriority(b)) ? 1 : -1).some(function (role) {
			//Do we have enough of this role?
			// console.log("@2", role, root.getTargetQuantity(role), root.getNumberOfRole(role))
			if (root.getTargetQuantity(role) * overload <= root.getNumberOfRole(role)) {
				return false;
			}

			//Am I not able to have a role?
			if (creep == null) {
				targetRole = role;
				return true;
			}

			var myRole = creep.memory.role;

			//Do I have a role?
			if (myRole == undefined) {
				targetRole = role;
				return true;
			}

			//Do I already have that role?
			if (myRole == role) {
				return true;
			}

			//Is my current role more important?
			if (root.getPriority(myRole) > root.getPriority(role)) {
				return true;
			}


			targetRole = role;
			return true;
		});

		return targetRole;
	}

	static getOptionalRole(creep = null) {
		var role = null
		for (let overload = 1; overload <= 4; overload++) {
			role = this.getNeededRole(creep, overload);
			if (role != null) {
				break;
			}
		}
		return role;
	}

	static moveTo(creep, destination) {
		return creep.moveTo(destination, { visualizePathStyle: { stroke: this.getPathStroke(creep) } });
	}

	static actOrMove(creep, activity, target = null) {
		var destination = null; 
		if (target == null) {
			destination = Game.getObjectById(creep.memory.energySource);
			if (destination == null) {
				return this.task_newEnergyStart(creep);
			}
		} else {
			destination = this.getDestination(creep, activity, target);
		}

		var errorCode = null;
		switch (activity) {
			case constants.ACTIVITY_HARVEST:
				errorCode = creep.harvest(destination);
				switch (errorCode) {
					case ERR_TIRED:
					case ERR_NOT_OWNER:
					case ERR_NOT_FOUND:
					case ERR_INVALID_TARGET:
					case ERR_NOT_ENOUGH_RESOURCES:
						return this.task_newEnergyStart(creep);
						break
				}
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

		switch (errorCode) {
			case ERR_NOT_IN_RANGE:
				this.moveTo(creep, destination);
				break;
			case OK:
				break;
			default:
				this.energyWithNoDestination(creep);
		}
		return errorCode;
	}

	static energyWithNoDestination(creep) {
		////Move off the road if you are standing on one
		//const look = creep.pos.look();
		//look.forEach(function (lookObject) {
		//    if (lookObject.type == LOOK_STRUCTURES) {
		//        console.log("@3; " + lookObject.structure.structureType + "; " + STRUCTURE_ROAD + "; " + (lookObject.structure.structureType == STRUCTURE_ROAD));
		//    }
		//});

		if (this.checkJobBoard(creep)) {
			return;
		}

		if (creep.carry.energy >= 0) {
			var destination = this.getDestination(creep, constants.ACTIVITY_BUILD, FIND_CONSTRUCTION_SITES);
			var errorCode = creep.build(destination);
			switch (errorCode) {
				case OK:
					return
				case ERR_NOT_IN_RANGE:
					this.moveTo(creep, destination);
			}
		}

		//Move to the idle flag
		var target = Game.flags.IdleFlag;
		if (!target) {
			var spawnerClass = require('class.spawner');
			var spawner = Game.spawns[spawnerClass.spawnerName];
			target = new RoomPosition(spawner.pos.x - 3, spawner.pos.y - 3, spawner.pos.roomName).createFlag("IdleFlag");
		}
		this.moveTo(creep, target)

		//Heal yourself if you can
		creep.heal(creep)
	}

	static checkJobBoard(creep) {
		var targetRole = this.getNeededRole(creep);
		if ((targetRole != null) && (creep.memory.role != targetRole)) {
			console.log("Changing role from ", this.getRoleName(creep.memory.role), " to ", this.getRoleName(targetRole));
			creep.say("-> " + targetRole);
			creep.memory.role = targetRole;
			return true;
		}
		return false;
	}
}

module.exports = CreepClass;