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
    const scores = {};
    let groupedRuns = vanRunStore.vanRuns;
    let generationCount = 0;
    // initialize the fitness scores
    // TODO:  move this to getScores()
    _.forEach(groupedRuns, (run) => {
        if (!run) return;
        const score = fitness(run.rideOrder);
        console.log('vanRunId, ORIGINAL score', run.vanRunId, ': ', score);
        scores[run.vanRunId] = score;
    });
    // Optimize the rideOrder for each run
    while (generationCount < generations) {
        _.forEach(groupedRuns, (run) => {
            if (!run) return;
            const vanRunId = run.vanRunId;
            let newRunOrder = flips(run.rideOrder);
            let newScore = fitness(newRunOrder);
            if (newScore < scores[vanRunId]) {
                scores[vanRunId] = newScore;
                run.rideOrder = newRunOrder;
            }
        }); // end forEach run
        generationCount++;
    }// end while for optimizing ride orders
    _.forEach(groupedRuns, (run) => {
        if (!run) return;
        console.log('vanRunId, FINAL score', run.vanRunId, ': ', scores[run.vanRunId], ' rideCount ', run.rideOrder.length);
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
            // Replace vanRunStore.vanRuns with newVanRuns
            // Create each new Van Run, reallocting rides
            //    vanRunStore.newVanRun
            // Delete each old Van Run by id
            //    vanRunStore.removeVanRun
        }
    }
    cb();
};

const getScores = (groupedRuns) => {
    //TODO:  return scores
    return null;
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
        copiedRideOrder[pos1] = rideOrder[pos2];
        copiedRideOrder[pos2] = rideOrder[pos1];
        valid = isValid(copiedRideOrder);
        tries = tries + 1;
    }
    if (valid) return copiedRideOrder;
    console.log('INVALID rideOrder ');
    return rideOrder;
};

const showBalance = (groupedRuns) => {
    const available = _.filter(groupedRuns, (o) => {
        return o.rideOrder.length -1 < vanRunMaxRides;
    });
    const overfull = _.filter(groupedRuns, (o) => {
        return o.rideOrder.length -1 > vanRunMaxRides;
    });
    console.log('available ', available.length);
    console.log('overfull ', overfull.length);
    return {
        available,
        overfull
    };
};

const splitRuns = (modelVanRuns) => {
    //Find the overfull van runs
    //Count its rides by destination
    //Create a new van run with same destination
    // move some of the rides for that destination
    // to the new van run so each total
    // is less than the maximum van run size
    let balance = showBalance(modelVanRuns);
    _.forEach(balance.overfull, run => {

    });
    return modelVanRuns;
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
    let modelVanRuns = _.assign(vanRunStore.vanRuns);
    modelVanRuns = splitRuns(modelVanRuns);
    console.log('Post splitRuns');
    let balance = showBalance(modelVanRuns);
    modelVanRuns = dissolveRuns(modelVanRuns);
    console.log('Post dissolveRuns');
    balance = showBalance(modelVanRuns);
    modelVanRuns = mergeRuns(modelVanRuns);
    console.log('Post mergeRuns');
    balance = showBalance(modelVanRuns);
    return modelVanRuns;
};

const functions = {
    generateDNAStrands
};

module.exports = functions;