"use strict";

/*
    Generate ride orders using randomization,
    order flipping, and strand combinations.

    Rank each result against the fitness function.

    Use best fits to generate next set of results.
 */

const _ = require('lodash');
const vanRunStore = require('../objectStores/vanRunStore');
const randomInt = require('../utilityFunctions/functions').randomInt;
const fitness = require('../optimization/fitness').fitness;
const isValid = require('../optimization/fitness').isValid;

const vanRunMaxRides = 6;  //this might relate to van capacity

const generateDNAStrands = (generations, cb) => {
    let groupedRuns = vanRunStore.vanRuns;
    let generationCount = 0;
    // initialize the fitness scores
    let scores = getScores(groupedRuns);
    let unoptimizedScores = _.assign([], scores);
    // Optimize the rideOrder for each run
    while (generationCount < generations) {
        _.forEach(groupedRuns, (run) => {
            if (!run) return;
            const vanRunId = run.vanRunId;
            let newRunOrder = flips(run.rideOrder);
            let newScore = fitness(newRunOrder);
            if (newScore < scores[vanRunId]) {
                console.log("generator improved score from flips for vanRunId: ", vanRunId)
                scores[vanRunId] = newScore;
                run.rideOrder = newRunOrder;
            }
        }); // end forEach run
        generationCount++;
    }// end while for optimizing ride orders
    _.forEach(groupedRuns, (run) => {
        if (!run) return;
        console.log('Optimized score vanRunId:', run.vanRunId, ': ', unoptimizedScores[run.vanRunId], ' to ', scores[run.vanRunId], ' stop count ', run.rideOrder.length);
    });
    // Model recombinations of the van runs
    // Replace van runs with the best scored
    // recombinations modeled

    generationCount = 0;
    while (generationCount < generations) {
        generationCount++;
        const fitTest = _.sum(getScores(vanRunStore.vanRuns));
        const newVanRuns = recombine();
        const newFitTest = _.sum(getScores(newVanRuns));
        if (newFitTest < fitTest) {
            console.log('recombine improvement');
            // Replace vanRunStore.vanRuns with newVanRuns
            // Create each new Van Run, reallocting rides
            //    vanRunStore.newVanRun
            // Delete each old Van Run by id
            //    vanRunStore.removeVanRun
        }
    }
    //cb();
};

const getScores = (groupedRuns) => {
    let scores = {};
    _.forEach(groupedRuns, (run) => {
        //console.log('scores: map ', _.map(run.rideOrder, 'origin.name'));
        if (!run) return;
        const score = fitness(run.rideOrder);
        scores[run.vanRunId] = score;
    });
    return scores;
}

const flips = (rideOrder, maxTries=3, includeLast=false) => {
    const copiedRideOrder = _.assign(rideOrder);
    const max = includeLast ?
        copiedRideOrder.length - 1
        : copiedRideOrder.length - 2;
    if (max < 2) return rideOrder;
    let valid = false;
    let tries = 0;
    while (!valid && tries < maxTries) {
        const pos1 = randomInt(0, max);
        let pos2 = randomInt(0, max);
        while (pos1 == pos2) {
            pos2 = randomInt(0, max);
        }
        const pos1copy = copiedRideOrder[pos1];
        copiedRideOrder[pos1] = rideOrder[pos2];
        copiedRideOrder[pos2] = pos1copy;
        valid = isValid(copiedRideOrder);
        tries = tries + 1;
    }
    if (valid) return copiedRideOrder;
    console.log('INVALID rideOrder ');
    return rideOrder;
};

const availability = (groupedRuns) => {
    const available = _.filter(groupedRuns, (o) => {
        return (o.rideOrder.length -1) < vanRunMaxRides;
    });
    const overfull = _.filter(groupedRuns, (o) => {
        return (o.rideOrder.length -1) > vanRunMaxRides;
    });
    //console.log('available ', available.length);
    //console.log('overfull ', overfull.length);
    return {
        available,
        overfull
    };
};

const splitRuns = (realVanRuns) => {
    // TODO:  finish this
    //Create a model set of van runs
    //with small rideCount sizes
    //Count its rides by destination
    //Create a new van run with same destination
    // move some of the rides for that destination
    // to the new van run so each total
    // is less than the maximum van run size
    const modelRuns = _.assign(realVanRuns);
    let balance = availability(modelRuns);
    _.forEach(balance.overfull, run => {
        let len = run.rideOrder.length;
        const runsNeeded = Math.ceil(len/vanRunMaxRides);
        console.log('len, needed, origin ', len, runsNeeded, _.map(run.rideOrder, 'origin.name')[0]);
        const rideBatches = [];
        let moved = 0;
        for(var i=0; i< runsNeeded; i++){
            const upTo = Math.min(moved + vanRunMaxRides, len);
            rideBatches[i] = _.slice(run.rideOrder, moved, upTo);
            moved = upTo;
            // TODO:  create additional runs
            //         with destination
            //       and move the overflow rides
            // something like:
            //const modelRun = _.assign({}, run);
            //modelRun.rideOrder = rideBatches[i];
            //modelRuns.push(vanRunStore.newVanRun(modelRun));
        }
    });
    return modelRuns;
};

const dissolveRuns = (modelVanRuns) => {
    // Deal with invalid runs
    // or runs with very low ride counts
    // Like split runs, move to
    // runs with nothing but a single origin and destination
    return modelVanRuns;
};

const mergeRuns = (modelVanRuns) => {
    // merge the available van runs
    // make sure the ride totals are less than the maximum
    // flip ride orders until they are valid
    return modelVanRuns;
};

const recombine = (maxTries=3) => {
    let modelVanRuns = splitRuns(vanRunStore.vanRuns);
    console.log('\nRecombine, after splitRuns()');
    let balance = availability(modelVanRuns);
    modelVanRuns = dissolveRuns(modelVanRuns);
    //console.log('Post dissolveRuns');
    balance = availability(modelVanRuns);
    modelVanRuns = mergeRuns(modelVanRuns);
    //console.log('Post mergeRuns');
    balance = availability(modelVanRuns);
    return modelVanRuns;
};

const functions = {
    generateDNAStrands
};

module.exports = functions;