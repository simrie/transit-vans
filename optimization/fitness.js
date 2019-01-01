"use strict";

/*
    Fitness function rates the efficiency of
    a van run's ride pickup and dropoff order
    by returning the sum of the
    distances between stops.

    Each ride's destination must occur in the
    order after the origin.

    If the van run ride order is invalid
    the fitness rank is an automatic 0.
 */

const _ = require('lodash');
const calc = require('../utilityFunctions/functions').calculateDistance;
const findLocIndex = require('../objectStores/locationStore').findLocIndex;


const isValid = (rideOrder) => {
    let validity = true;
    // for each ride the destination stop
    // must occur later than the origin
    // in the ride order
    // Order of Stops:
    const stops = _.map(rideOrder, 'origin');
    //console.log('stops ', stops);
    _.forEach(rideOrder, ride => {
        const originIndex = findLocIndex(stops, ride.origin);
        const destIndex = findLocIndex(stops, ride.destination);
        // terminus stops do not have a destination
        if (destIndex && destIndex < originIndex) {
           validity = false;
        }
    });
    return validity;
}

const calcDistances = (rideOrder) => {
    const distances = [];
    let index = 0;
    if (rideOrder.length <= 2) {
        return 0;
    };
    _.forEach(rideOrder, ride => {
        if (index > 2) {
            const lastRide = rideOrder[index -1];
            const d = calc(lastRide.origin, ride.origin);
            distances.push(d);
        };
        index++;
    });
    return _.sum(distances);
};

const fitness = (rideOrder) => {
    const valid = isValid(rideOrder);
    if (!valid) return 0;
    return calcDistances(rideOrder);
};

const functions = {
    fitness,
    isValid
};

module.exports = functions;