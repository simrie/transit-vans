"use strict";

/*
    Singleton to store vanRun  objects
        created by the optimizer.
    In a real system this would be replaced
    by a persistent external database.
 */

const find = require('lodash/find');
const forEach = require('lodash/forEach');
const remove = require('lodash/remove');
const values = require('lodash/values');
const vanRunObject = require('../objectClasses/vanRun');
const utilfs = require('../utilityFunctions/functions');
const rideStore = require('./rideStore.js');

const vanRuns = {};
const idGen = utilfs.idGenerator();

const findVanRun = (predicate) => {
    return find(values(vanRuns), predicate);
};


const removeVanRun = (vanRunId) => {
   //vanRuns[vanRunId] = null;
    return vanRuns[vanRunId];
};

const addUnorderedRides = (vanRunId, rides) => {
    const vanRun = findVanRun( {vanRunId: vanRunId} );
    //const rides = rideStore.findRides(ridesPredicate);
    forEach(rides, (ride) => {
        ride.vanRunId = vanRunId;
        vanRun.rideOrder.push(ride);
    });
};

const reallocateRide = (rideId, fromVanId, toVanId) => {
    const fromVanRun = findVanRun( {vanRunId: fromVanId} );
    const rideOrder = fromVanRun.rideOrder;
    const rides = remove(rideOrder, { rideId });
    addUnorderedRides(toVanId, rides);
};

const newVanRun = (run) => {
    const vanRun = vanRunObject();
    const vanRunId = idGen.next().value;
    vanRun.vanRunId = vanRunId;
    vanRun.endDestination = run.destination;
    vanRun.rideOrder = run.rides;
    console.log('new vanRunId: ', vanRunId, vanRun.endDestination.name, ' rides: ', vanRun.rideOrder.length);
    vanRuns[vanRunId] = vanRun;
    return vanRun;
};

const vanRunStore = (() => {
    return {
        vanRuns,
        addUnorderedRides,
        reallocateRide,
        removeVanRun,
        findVanRun,
        newVanRun
    }
})();


module.exports = vanRunStore;