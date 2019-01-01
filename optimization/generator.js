"use strict";

/*
    Generate ride orders using randomization,
    order flipping, and strand combinations.

    Rank each result against the fitness function.

    Use best fits to generate next set of results.
 */

const _ = require('lodash');
const randomInt = require('../utilityFunctions/functions').randomInt;
const fitness = require('../optimization/fitness').fitness;
const isValid = require('../optimization/fitness').isValid;

const generateDNAStrands = (groupedRuns, generations, cb) => {
    const scores = {};
    //const rideOrders = {};
    let generationCount = 0;
    // initialize the fitness scores
    _.forEach(groupedRuns, (run) => {
        if (!run) return;
        const score = fitness(run.rideOrder);
        console.log('vanRunId, score', run.vanRunId, ': ', score);
        scores[run.vanRunId] = score;
        //rideOrders[run.vanRunId] = run.rideOrder;
    });
    // this should optimize the rideOrder for each run
    while (generationCount < generations) {
        console.log('start while ', generationCount);
        _.forEach(groupedRuns, (run) => {
            if (!run) return;
            const vanRunId = run.vanRunId;
            console.log('vanRunId, OLD score ', vanRunId, ': ', scores[vanRunId]);
            let newRunOrder = flips(run.rideOrder);
            let newScore = fitness(newRunOrder);
            if (newScore < scores[vanRunId]) {
                scores[vanRunId] = newScore;
                run.rideOrder = newRunOrder;
                console.log('vanRunId, NEW score', vanRunId, ': ', newScore);
            }
        }); // end forEach run
        generationCount++;
    }// end while
    // this should attempt to combine van runs


    // show results
    cb();
};

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
    return rideOrder;
};

const combinations = (groupedRuns) => {

};

const functions = {
    generateDNAStrands
};

module.exports = functions;