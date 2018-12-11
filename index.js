"use strict";

/*
    Generate n rides for a period of time where
    pick up locations are random x and y,
    arrival times are in a span of t time Plus h hours,
    and destinations are randomly selected from
    well-known locations.
 */

const gridSize = 40;
const knownLocationCount = 20;
const locationStore = require('./vanRouter/locationStore');
//const locationStore = require('locationStore');
//locationStore.initWellKnownLocations(knownLocationCount, gridSize, gridSize);

console.log(locationStore.wellKnownLocations);

const rideStore = require('./vanRouter/rideStore');
//rideStore.testLocationStore();
//const rideStore = require('rideStore');
//rideStore.createRides(10, gridSize, gridSize);

console.log(rideStore.rides);