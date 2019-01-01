"use strict";

/*
    Generate n rides for a period of time where
    pick up locations are random x and y,
    arrival times are in a span of t time Plus h hours,
    and destinations are randomly selected from
    well-known locations.
 */

const dispatcher = require('./vanRouter/dispatcher');
const generator = require('./optimization/generator');
const optimizer = require('./optimization/optimizer');
const rideStore = require('./objectStores/rideStore');
const locationStore = require('./objectStores/locationStore');
const vanRunStore = require('./objectStores/vanRunStore');
const _ = require('lodash');

const gridSize = 40;
const knownLocationCount = 20;
const ridesToCreate = 30;
const generations = 10;

const locations = locationStore.initWellKnownLocations(knownLocationCount, gridSize, gridSize);
//rideStore.testLocationStore();
const rides = rideStore.createRides(ridesToCreate, gridSize, gridSize);
//console.log(rides);

const groupedRuns = dispatcher.groupRidesByDestination(rides);
//console.log('INITIAL Grouped Runs from Dispatcher \n', groupedRuns);

_.forEach(groupedRuns, run => {
    console.log('groupedRuns map ', _.map(run.rideOrder, 'origin.name'));
})

const cb = () => {
    console.log('vanRuns from Store: ', vanRunStore.vanRuns);
};

// These groupedRuns can be the DNA for the genetic algorithm.
const dna = generator.generateDNAStrands(generations, cb);




// Forced (non-genetic) Optimization by merging of groupedRuns
// attempted with combinedRuns and doRunMerges

// combinedRuns just does merges on the spot and is better than expected
//optimizer.combineRuns(cb);

// doRunMerges ranks the merge possibilities first but is not as good as it should be
//optimizer.doRunMerges(cb);




