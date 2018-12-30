"use strict";

/*
    The dispatcher bundles rides in to van runs.
    The dispatcher can alter van runs mid-run
    based on changing situations.
    The dispatcher uses optimization decision making.
 */

const _ = require('lodash');
const utilfs = require('../utilityFunctions/functions');
//const vanRunStore = require('../objectStores/vanRunStore');

const groupRidesByDestination = (rides) => {
    const groupedRuns = _.groupBy(rides, 'destination.id');
    const runs = [];
    _.forEach(groupedRuns, run => {
        const newRun = {
            rides: run,
            destination: run[0].destination
        };
        runs.push(newRun);
    })
    return runs;
}

const destinationDistanceMap = (runs) => {
    const distances = [];
    const destinations1 = _.map(runs, 'destination');
    const destinations2 = _.assign(destinations1);
    _.forEach(destinations1, dest1 => {
        const baseId = dest1.id;
        _.forEach(destinations2, dest2 => {
            if (dest1.id !== dest2.id) {
                const obj = {};
                const id = `${dest1.id}:${dest2.id}`;
                if (dest2.id >= baseId) {
                    obj.id = id;
                    obj.value = utilfs.calculateDistance(dest1, dest2);
                    distances.push(obj);
                }
            }
        })
    })
    return distances
}

const orderDestinations = (destinations) => {
    return _.orderBy(destinations, 'value');
}

const functions = {
    groupRidesByDestination,
    destinationDistanceMap,
    orderDestinations
};

module.exports = functions;
