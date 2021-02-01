"use strict";

/*
    Module that exposes methods that
    generate optimized example van routes
    as arrays or d3-plottable lines and
    further optimize by recombining the routes
    as arrays or d3-plottable lines.
 */

const dispatcher = require('./vanRouter/dispatcher');
const generator = require('./optimization/generator');
const optimizer = require('./optimization/optimizer');
const rideStore = require('./objectStores/rideStore');
const locationStore = require('./objectStores/locationStore');
const vanRunStore = require('./objectStores/vanRunStore');
const _ = require('lodash');

const generate = (args) => {
    // const gridSize = 40;
    // const knownLocationCount = 20;
    // const ridesToCreate = 30;
    // const generations = 100;
    // const recombinations = 1;
    const { gridSize, knownLocationCount, ridesToCreate, generations } = args;

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
        //console.log('vanRuns from Store: ', vanRunStore.vanRuns);
    };

    // These groupedRuns can be the DNA for the genetic algorithm.
    //const dna = generator.generateDNAStrands(generations, cb);

    //return dna;
    return groupedRuns;
}

const optimize = (args) => {
    const { groupedRuns } = args;
    console.log('optimizer: groupedRuns', groupedRuns.length);
    const optimized = generator.runFlipper(groupedRuns);
    return optimized;
}

const recombine = (groupedRuns) => {
    return "recombined";
}

const transitVans = (() => {
    return {
        generate,
        optimize,
        recombine
    }
})();


module.exports = transitVans;