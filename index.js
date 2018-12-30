"use strict";

/*
    Generate n rides for a period of time where
    pick up locations are random x and y,
    arrival times are in a span of t time Plus h hours,
    and destinations are randomly selected from
    well-known locations.
 */

const dispatcher = require('./vanRouter/dispatcher');
const optimizer = require('./optimization/optimizer');
const rideStore = require('./objectStores/rideStore');
const locationStore = require('./objectStores/locationStore');
const vanRunStore = require('./objectStores/vanRunStore');
const _ = require('lodash');

const gridSize = 40;
const knownLocationCount = 20;

const locations = locationStore.initWellKnownLocations(knownLocationCount, gridSize, gridSize);
//rideStore.testLocationStore();
const rides = rideStore.createRides(10, gridSize, gridSize);
//console.log(rides);

const groupedRuns = dispatcher.groupRidesByDestination(rides);
console.log('INITIAL Grouped Runs \n', groupedRuns);

const cb = () => {
    console.log('vanRuns from Store: ', vanRunStore.vanRuns);
};
// doRunMerges ranks the merge possibilities but is not as good as it should be
optimizer.doRunMerges(cb);

// combinedRuns just does merges on the spot and is better than expected
//const combinedRuns = optimizer.combineRuns(groupedRuns);
//console.log('combinedRuns :', combinedRuns);


//console.log('vanRuns from Store: ', vanRunStore.vanRuns);
