var ProfiledClass = require('class.profiled');

/**
 * GameObjectClass is the ancestor for all classes that wrap a Screeps
 * game object
 * Use: https://github.com/dmleach/scroops/blob/master/class.gameobject.js
 */
class GameObjectClass extends ProfiledClass {

    /**
     * The Scroops classes are envelopes around the classes provided by the
     * game. The game object around which the class is wrapped is stored
     * in the gameObject property.
     */
    constructor(gameObject) {
        super();

        this.gameObject = gameObject;
    }

    distance(position) {
        //let PathHelper = require('helper.path');
        //return PathHelper.distance(this.pos, position);
    }

    /**
     * Returns the id of the game object wrapped inside this class
     */
    get id() {
        return this.gameObject.id;
    }

    /**
     * Returns the name of the game object wrapped inside this class
     */
    get name() {
        return this.gameObject.name;
    }

    /**
     * Returns the position of the game object wrapped inside this class
     */
    get pos() {
        return this.gameObject.pos;
    }

    get room() {
        return this.gameObject.room;
    }

    get roomName() {
        return this.gameObject.room.name;
    }
}

module.exports = GameObjectClass;