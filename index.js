"use strict";

/*
    Generate n rides for a period of time where
    pick up locations are random x and y,
    arrival times are in a span of t time Plus h hours,
    and destinations are randomly selected from
    well-known locations.
 */

const dispatcher = require('./vanRouter/dispatcher');
const rideStore = require('./objectStores/rideStore');
const locationStore = require('./objectStores/locationStore');

const gridSize = 40;
const knownLocationCount = 20;

const locations = locationStore.initWellKnownLocations(knownLocationCount, gridSize, gridSize);
//rideStore.testLocationStore();
const rides = rideStore.createRides(10, gridSize, gridSize);
//console.log(rides);

const groupedRuns = dispatcher.groupRidesByDestination(rides);
console.log(groupedRuns);

const distances = dispatcher.destinationDistanceMap(groupedRuns);
console.log('Distances :', distances);

const orderedDestinations = dispatcher.orderDestinations(distances);
console.log('orderedDestinations :', orderedDestinations);
