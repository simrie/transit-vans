"use strict";

/*
    Singleton to store vanRun  objects
        created by the optimizer.
    In a real system this would be replaced
    by a persistent external database.
 */

const find = require('lodash/find');
const forEach = require('lodash/forEach');
const remove = require('lodash/forEach');

const rideStore = require('./rideStore.js');
const vanRuns = {};

function* generateVanRunId() {
    let value = 0;
    while(true) {
        yield value + 1;
    }
};

const findVanRun = (predicate) => {
    return find(this.vanRuns, predicate);
};

const addUnorderedRides = (vanRunId, ridesPredicate) => {
    const vanRun = find(this.vanRuns, {vanRunId: vanRunId} );
    const rides = rideStore.findRides(predicate);
    forEach(rides, (ride) => {
        ride.vanRunId = vanRunId;
        vanRun.rideOrder.push(ride);
    });
};

const reallocateRide = (rideId, fromVanId, toVanId) => {
    const fromVanRun = find(this.vanRuns, {vanRunId: fromVanId} );
    const toVanRun = find(this.vanRuns, {vanRunId: toVanId} );
    const rides = remove(fromVanRun.rideOrder, { rideId });
    this.addUnorderedRides(toVanId, rides);
};

const newVanRun = (vanRun) => {
    vanRun.vanRunId = generateVanRunId();
    this.vanRuns[vanRunId] = vanRun;
};

const vanRunStore = {
    vanRuns: this.vanRuns,
    addUnorderedRides,
    findVanRun,
    newVanRun
};


modules.export = vanRunStore;