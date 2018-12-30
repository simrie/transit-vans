"use strict";

/*
    The dispatcher bundles rides in to van runs.
    The dispatcher can alter van runs mid-run
    based on changing situations.
    The dispatcher uses optimization decision making.
 */

const _ = require('lodash');
const utilfs = require('../utilityFunctions/functions');
const vanRunStore = require('../objectStores/vanRunStore');

const groupRidesByDestination = (rides) => {
    const groupedRuns = _.groupBy(rides, 'destination.id');
    const runs = [];
    _.forEach(groupedRuns, run => {
        const newRun = {
            rides: run,
            destination: run[0].destination
        };
        runs.push(newRun);
        vanRunStore.newVanRun(newRun);
    })
    return runs;
}

const functions = {
    groupRidesByDestination
};

module.exports = functions;
