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

const mergeRuns = (vanRun1Id, vanRun2Id) => {
    const vanRun2 = findVanRun( {vanRunId: vanRun2Id} );
    forEach(vanRun2.rideOrder, ride => {
        if (ride) {
            console.log('Merge reallocate ride ', ride.rideId, ' from ', vanRun2Id, ' to ', vanRun1Id);
            vanRunStore.reallocateRide(ride.rideId, vanRun2Id, vanRun1Id);
        }
    });
    const vanRun1 = findVanRun( {vanRunId: vanRun1Id} );
    //console.log('vanRun1: ', vanRun1.rideOrder.length);
    return vanRun1.rideOrder.length;
};

const removeVanRun = (vanRunId) => {
   vanRuns[vanRunId] = null;
};

const addUnorderedRides = (vanRunId, rides) => {
    const vanRun = findVanRun( {vanRunId: vanRunId} );
    //do not yet assign to rideStore objects
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
    // TODO:  This ride should be inserted
    // next to closest existing ride stop,
    // not added to the end
    addUnorderedRides(toVanId, rides);
};

const newVanRun = (run) => {
    const vanRun = vanRunObject();
    const vanRunId = idGen.next().value;
    vanRun.vanRunId = vanRunId;
    vanRun.endDestination = run.destination || run.endDestination;
    //vanRun.rideOrder = run.rides;
    vanRuns[vanRunId] = vanRun;
    addUnorderedRides(vanRunId, run.rides);
    console.log('new vanRunId: ', vanRunId, vanRun.endDestination.name, ' stops: ', vanRun.rideOrder.length);
    return vanRun;
};

const vanRunStore = (() => {
    return {
        vanRuns,
        addUnorderedRides,
        reallocateRide,
        removeVanRun,
        findVanRun,
        newVanRun,
        mergeRuns
    }
})();


module.exports = vanRunStore;