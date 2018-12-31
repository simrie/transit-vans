"use strict";

/*
    The optimizer looks at all rides requested and
    attempts to bundle them by:
        majorDestinationObject
        and requestedArrivalTime

    Additional pickups are added in based on
        location proximity to an existing route
        requestedPickupTime or
        requestedArrivalTime

    Any ride dropoff location might be
        destinated as a majorDestinationObject

 */

const _ = require('lodash');
const utilfs = require('../utilityFunctions/functions');
const vanRunStore = require('../objectStores/vanRunStore');

const vanRunMaxRides = 6;  //this might relate to van capacity
const proximityLimit = 25; //this is arbitrary

const destinationDistanceMap = () => {
    const runs = vanRunStore.vanRuns;
    const distances = [];
    const destinations1 = _.map(runs, 'endDestination');
    const destinations2 = _.assign(destinations1);
    //destinationDistances = [];
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
    return _.orderBy(distances, 'value');
};


const rankRunMerges = () => {
    const runs = vanRunStore.vanRuns;
    const destinationDistances = destinationDistanceMap();
    //console.log('destinationDistances ', destinationDistances);
    let proximityRank = destinationDistances.length;
    const rankedMergeRuns = [];
    _.forEach(destinationDistances, od => {
        proximityRank--;
        const destIds = od.id.split(':');
        console.log('od combination candidates: ', destIds);
        // Find van runs ending at these destinations
        const vanRun1Predicate = (o) => { return o.endDestination.id === _.parseInt(destIds[0])};
        const vanRun1 = vanRunStore.findVanRun(vanRun1Predicate);
        const vanRun2Predicate = (o) => { return o.endDestination.id === _.parseInt(destIds[1])};
        const vanRun2 = vanRunStore.findVanRun(vanRun2Predicate);
        if (vanRun1 && vanRun2) {
            //Assign to potential merge
            const van1Count = vanRun1.rideOrder.length;
            const van2Count = vanRun2.rideOrder.length;
            const efficiencyRank = vanRunMaxRides -(van1Count + van2Count);
            const obj = {
                id: od.id,
                destinationDistance: od.value,
                vanRun1Id: vanRun1.vanRunId,
                vanRun2Id: vanRun2.vanRunId,
                vanRun1Count: van1Count,
                vanRun2Count: van2Count,
                efficiencyRank,
                proximityRank
            };
            //console.log('ranked: ', obj);
            rankedMergeRuns.push(obj);
        }
    })
    return rankedMergeRuns;
};

const sortRankedMergeRuns = () => {
    const rankedMergeRuns = rankRunMerges();
    return _.reverse(_.sortBy(rankedMergeRuns, [(obj) => {
        return 2 * obj.efficiencyRank + obj.proximityRank;
    }]));
};

const doRunMerges = (cb) => {
    // TODO:  Fix it so it does some good
    // Avoid A to B, then C to A type merges.
    // Has to be A to B, then C to B.
    //      The mergeForwarding is not working right
    //      because merged runs are getting
    //      rides merged to them that should be
    //      forwarded to where the run got merged.
    //      i.e., C to A where A already went to B.
    //      The rideCounts aren't correct
    //       some fixing might be in vanRunStore
    const sortedRankedMergeRuns = sortRankedMergeRuns();
    const mergeFrom = []; //ride counts go to zero
    const mergeForwarding = {}; //ride counts go up
    const newRideCounts = {};
    _.forEach(sortedRankedMergeRuns, obj => {
        let okToMerge = true;
        let vanRun1Id = mergeForwarding[obj.vanRun1Id] || obj.vanRun1Id;
        let vanRun2Id = mergeForwarding[obj.vanRun2Id] || obj.vanRun2Id;
        let newRideCount = (newRideCounts[vanRun1Id] || obj.vanRun1Count) + (newRideCounts[vanRun2Id] || obj.vanRun2Count);

        if (vanRun1Id == vanRun2Id) {
            okToMerge = false;
            console.log('Already merged, okToMerge=', okToMerge);
        }
        if (newRideCount > vanRunMaxRides) {
            okToMerge = false;
            console.log('Ride count would be too high, okToMerge=', okToMerge);
        }
        if (obj.destinationDistance > proximityLimit) {
            okToMerge = false;
            console.log('Too far, okToMerge=', okToMerge);
        }
        console.log('\nokToMerge ', okToMerge);
        if (okToMerge) {
            newRideCount = vanRunStore.mergeRuns(vanRun1Id, vanRun2Id);
            console.log('newRideCount ', newRideCount);
            if (newRideCount > 0) {
                mergeFrom.push(vanRun2Id);
                mergeForwarding[vanRun2Id] = vanRun1Id;
                newRideCounts[vanRun1Id] = newRideCount;
                newRideCounts[vanRun2Id] = 0;
                console.log('newRideCounts[vanRun1Id]: ', newRideCounts[vanRun1Id]);
            }
        }
        console.log('\n');
    });
    console.log('mergeFrom ', mergeFrom);
    console.log('mergeForwarding ', mergeForwarding);
    console.log('newRideCounts ', newRideCounts);
    console.log('Van runs that could be deleted: ', _.uniq(mergeFrom));
    cb();
};

const combineRuns = (cb) => {
    // Problem:  this causes A to B, then C to A type merges.
    // Replace this functions that:
    // 1)  rank potential Run Merges
    // 2)  merge the best candidates
    const groupedRuns = vanRunStore.vanRuns;
    const orderedDestinations = destinationDistanceMap();
    const combinedRuns = [];
    //TODO:  improve criteria for combine decision
    //const vanRunMaxRides = 6; //this is arbitrary
    const max = _.maxBy(orderedDestinations, 'value');
    const min = _.minBy(orderedDestinations, 'value');
    console.log(' min ', min, ' max ', max);
    _.forEach(orderedDestinations, od => {
        //const od = min;
        if (od.value < (max.value - min.value)/2) {
            const destIds = od.id.split(':');
            console.log('od combination candidates: ', destIds);
            const vanRun1Predicate = (o) => { return o.endDestination.id === _.parseInt(destIds[0])};
            const vanRun1 = vanRunStore.findVanRun(vanRun1Predicate);
            const vanRun2Predicate = (o) => { return o.endDestination.id === _.parseInt(destIds[1])};
            const vanRun2 = vanRunStore.findVanRun(vanRun2Predicate);
            if (vanRun1 && vanRun2 && vanRun2.rideOrder.length > 0 && ((vanRun1.rideOrder.length + vanRun2.rideOrder.length) <= vanRunMaxRides)) {
                // combine these runs
                _.forEach(vanRun2.rideOrder, ride => {
                    if (!ride) return;
                    console.log('reallocate ', ride.rideId, ' from ', vanRun2.vanRunId, ' to ', vanRun1.vanRunId);
                    vanRunStore.reallocateRide(ride.rideId, vanRun2.vanRunId, vanRun1.vanRunId);
                });
            }
        }
    })
    cb();
}

const functions = {
    combineRuns,
    doRunMerges
};

module.exports = functions;
