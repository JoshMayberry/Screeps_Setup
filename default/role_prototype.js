/*
 * A base class that every creep will use.
 * Use: https://github.com/Garethp/Screeps/blob/master/role_prototype.js
 */

module.exports = {
	creep: null,

	setCreep: function(creep)
	{
		this.creep = creep;
		return this;
	},

	run: function()
	{
		if(this.creep.memory.onSpawned == undefined) {
			this.onSpawn();
			this.creep.memory.onSpawned = true;
		}

		this.action(this.creep);

		if(this.creep.ticksToLive == 1)
			this.beforeAge();
	},

	handleEvents: function()
	{
		if(this.creep.memory.onSpawned == undefined) {
			this.onSpawnStart();
			this.onSpawn();
			this.creep.memory.onSpawned = true;
		}

		if(this.creep.memory.onSpawnEnd == undefined && !this.creep.spawning) {
			this.onSpawnEnd();
			this.creep.memory.onSpawnEnd = true;
		}
	},

	getParts: function() { 
	    return [Game.WORK, Game.CARRY, Game.MOVE];
	},

	action: function() { },

	onSpawn: function() { },

	onSpawnStart: function() { },

	onSpawnEnd: function() { },

	beforeAge: function() { },

};