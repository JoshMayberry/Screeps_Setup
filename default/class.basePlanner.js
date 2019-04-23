/// <reference path="C:/Users/Kade/source/repos/Screeps-Typescript-Declarations/dist/screeps.d.ts"/>
var constants = require('constants');
var spawnerClass = require('class.spawner');

class BasePlannerClass {
    //Use: https://stackoverflow.com/questions/8763125/get-array-of-objects-keys/10942889#10942889
    static printKeys(object) {
        var keys = [];
        for (var key in object) {
            keys.push(key);
        }
        console.log("@printKeys; " + keys);
    }

    static get maxSites() {
        return 10;
    }

    static get maxContainers() {
        return 10;
    }

    static canBuild(spawner, filterList, maximum) {
        var containerList = spawner.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return filterList;
            }
        });
        var containerPlanList = spawner.room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: (structure) => {
                return filterList;
            }
        });
        return (containerList.length + containerPlanList.length < maximum);
    }

    static main() {
        var spawner = Game.spawns[spawnerClass.spawnerName];
        var numberBuildable = this.getNumberBuildable(spawner);
        if (numberBuildable <= 0) {
            return;
        }

        for (var i = 0; i < numberBuildable; i++) {
            //Place containers near sources
            if (this.canBuild(spawner, (STRUCTURE_CONTAINER, STRUCTURE_STORAGE), this.maxContainers)) {
                var creep = null;
                for (let creepName in Game.creeps) {
                    creep = Game.creeps[creepName]
                    break;
                }

                var source = creep.pos.findClosestByRange(FIND_SOURCES);
                var buildSite = this.getBuildSite(source, 5, constants.PATTERN_JUST_TERRAIN);
                if (!buildSite) {
                    continue;
                }
                buildSite.createConstructionSite(STRUCTURE_CONTAINER);
            }

            //Place expansions in checker board around spawn
            //if (this.canBuild(spawner, (STRUCTURE_EXTENSION,), spawner.)) {

            //Have all screeps place roads where they are standing
            for (let creepName in Game.creeps) {
                var creep = Game.creeps[creepName];
                if (!this.hasRoad(creep.pos)) {
                    creep.pos.createConstructionSite(STRUCTURE_ROAD);
                    i++;
                }
            }
        }
    }

    static emptyCorners(target, item) {
        const cornerList = [[item.x - 1, item.y - 1], [item.x - 1, item.y + 1], [item.x + 1, item.y + 1], [item.x + 1, item.y - 1]]
        for (var i = 0; i < cornerList.length; i++) {
            var subItem = target.room.lookAt(cornerList[i][0], cornerList[i][1]);
            console.log("@2 ", [cornerList[i][0], cornerList[i][1]], [item.x, item.y]);
            this.printKeys(subItem);
            if (subItem.terrain == "wall") {
                return false;
            }
            if (constants.OBSTACLE_OBJECT_TYPES_INANIMATE.some(r => subItem.includes(r))) {
                return false;
            }
        }
        return true;
    }

    //See: https://docs.screeps.com/api/#Room.lookForAtArea
    static getBuildSite(target, maxRadius = 5, pattern = constants.PATTERN_JUST_TERRAIN) {
        for (var i = 1; i < maxRadius; i++) {
            //Look for available land near the target
            const foundList = target.room.lookAtArea(target.pos.y - i, target.pos.x - i, target.pos.y + i, target.pos.x + i, true);

            var answer;
            switch (pattern) {
                case constants.PATTERN_JUST_TERRAIN:
                    answer = _.find(foundList, function (item) {
                        return (item.terrain == "wall") && !item.structure && !item.constructionSite;
                    });
                    break;
                case constants.PATTERN_CHECKER_BOARD:
                    answer = _.find(foundList, function (item) {
                        var cornerList = [[item.x - 1, item.y - 1], [item.x - 1, item.y + 1], [item.x + 1, item.y + 1], [item.x + 1, item.y - 1]];
                        for (var j = 0; j < cornerList.length; j++) {
                            var corner = target.room.lookAt(cornerList[j][0], cornerList[j][1]);
                            if (corner.terrain == "wall") {
                                return false;
                            }
                            if (constants.OBSTACLE_OBJECT_TYPES_INANIMATE.some(r => subItem.includes(r))) {
                                return false;
                            }
                        }
                        return true;
                    });
                    break;
                default:
                    throw new Error("Unknown Pattern " + pattern);
            }

            if (answer) {
                return new RoomPosition(answer.x, answer.y, target.room.name);
            }
            //for (var j = 0; j < foundList.length; j++) {
            //    var item = foundList[j];
            //    if (item.terrain == "wall") {
            //        continue;
            //    }
            //    //this.printKeys(item)
            //    //console.log("@2 ", OBSTACLE_OBJECT_TYPES)
            //    switch (pattern) {
            //        case constants.PATTERN_JUST_TERRAIN:
            //            //    //Look for existing structure or construction site
            //            //    if (item.structure || item.constructionSite) {
            //            //        continue;
            //            //    }
            //            //    return new RoomPosition(item.x, item.y, target.room.name);
            //        //case constants.PATTERN_CHECKER_BOARD:
            //            console.log("@2", this.emptyCorners(target, item), item.x, item.y);
            //            //this.printKeys(item);
            //            console.log("");
            //            break;
                        
            //        default:
            //            throw new Error("Unknown Pattern " + pattern);
            //    }
            //}
        }
    }

    static getNumberBuildable(spawner) {
        var sites = spawner.room.find(FIND_CONSTRUCTION_SITES)
        if (sites.length < this.maxSites) {
            return this.maxSites - sites.length;
        }
        return 0;
    }

    static hasRoad(pos) {
        const look = pos.look();
        look.forEach(function (lookObject) {
            if (lookObject.type == LOOK_STRUCTURES) {
                if (lookObject.structure.structureType == STRUCTURE_ROAD) {
                    return true;
                }
            }
        });
        return false;
    }

    //Use: https://screeps.com/forum/topic/2248/road-building-and-findpathto/3#2
    static planRoadsToSources(spawner) {
       var sources = spawner.room.find(FIND_SOURCES);
        for (var i = 0; i < sources.length; i++) {
            var path = spawner.pos.findPathTo(sources[0].pos);
        }
    }

    //Use: https://screeps.com/forum/topic/2248/road-building-and-findpathto/3
    static makeRoadWithPath(path) {
        for (var i = 0; i < path.length; i++) {
            path[i].createConstructionSite(STRUCTURE_ROAD);
        }
    }
}

module.exports = BasePlannerClass;