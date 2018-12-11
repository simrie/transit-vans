"use strict";

/*
    Extracted common locations from active rides, by
        origin, destination
        and
        requestedDropoffTime with rideId.
 */

const filter = require('lodash/filter');
const locationObject = require('./../objectClasses/location');
const utilfs = require('./../utilityFunctions/functions');
const locationNames = [
    'VA Hospital',
    'Amtrak',
    'City Medical',
    'Shopping Center',
    'City Hall',
    'Community College',
    'Senior Center',
    'Rehabilitation Center'
];


const wellKnownLocations = [];
const destinations = {};
const origins = {};

function* generateLocationId() {
    let value = 0;
    while(true) {
        value = value + 1;
        yield value;
    }
};

const initWellKnownLocations = (n, maxX, maxY) => {
    for (let i = 0; i < locationNames.length; i++) {
        const id = generateLocationId().next();
        console.log(id);
        const loc = locationObject();
        const xy = utilfs.randomXY(maxX, maxY);
        loc.id = id.value;
        loc.x = xy.x;
        loc.y = xy.y;
        loc.name = locationNames[i];
        loc.visible = true;
        wellKnownLocations.push(loc);
    }
};

const findLoc = (collection, loc) => {
    const byId = filter(collection, { 'id': loc.id });
    if (byId) {
        return byId;
    };
    const byName = filter(collection, { 'name': loc.name });
    if (byName) {
        return byName;
    };
    const byXY = filter(collection, (o) => {
        o.x = loc.x && o.y == loc.y
    });
    if (byXY) {
        return byId;
    };
    return null;
};

const addOrigin = (loc) => {
    if (!findLoc(origins, loc)) {
        origins[loc.id] = loc;
    }
};

const addDestination = (loc) => {
    if (!findLoc(destinations, loc)) {
        destinations[loc.id] = loc;
    }
};

const newRandomLocation = (name, maxX, maxY) => {
    const loc = locationObject();
    const xy = utilfs.randomXY(maxX, maxY);
    loc.name = name;
    loc.x = xy.x;
    loc.y = xy.y;
    return loc;
};

const randomWellKnownLocation = () => {
    const rint = utilfs.randomInt(0, wellKnownLocations.length);
    return wellKnownLocations[rint];
}

const locationStore  = (() => {
    initWellKnownLocations(20, 40, 40);
    return {
        destinations,
        origins,
        wellKnownLocations,
        //initWellKnownLocations,
        findLoc,
        addOrigin,
        addDestination,
        newRandomLocation,
        randomWellKnownLocation,
        generateLocationId
    }
})();

/*
const locationStore = () => {
    return {
        destinations,
        origins,
        wellKnownLocations,
        initWellKnownLocations,
        findLoc,
        addOrigin,
        addDestination,
        newRandomLocation,
        randomWellKnownLocation
    }
}
*/


module.exports = locationStore;
