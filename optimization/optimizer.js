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
const vanRunStore = require('../objectStores/vanRunStore');

const combineRuns = (groupedRuns, orderedDestinations) => {
    const combinedRuns = [];
    //TODO:  improve criteria for combine decision
    const vanRunMaxRides = 6;
    const max = _.maxBy(orderedDestinations, 'value');
    const min = _.minBy(orderedDestinations, 'value');
    console.log(' min ', min, ' max ', max);
    _.forEach(orderedDestinations, od => {
    //const od = min;
        if (od.value < (max.value - min.value)/2) {
            const destIds = od.id.split(':');
            console.log('od combination candidates: ', destIds);
            //TODO: finish this
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
                console.log('removed: ', vanRunStore.removeVanRun(vanRun2.vanRunId));
            }
        }
    })
    return vanRunStore.vanRuns;
}

const functions = {
    combineRuns
};

module.exports = functions;
