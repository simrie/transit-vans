"use strict";

/*
    Generate ride orders using randomization,
    order flipping, and strand combinations.

    Rank each result against the fitness function.

    Use best fits to generate next set of results.
 */

const _ = require('lodash');
const fitness = require('../optimization/fitness').fitness;

const generateDNAStrands = (groupedRuns, generations) => {
    const scores = {};
    _.forEach(groupedRuns, (run) => {
        if (!run) return;
        const score = fitness(run.rideOrder);
        console.log('vanRunId, score', run.vanRunId, ': ', score);
        scores[run.vanRunId] = score;
    });
};

const flips = (runOrder) => {

};

const combinations = (groupedRuns) => {

};

const functions = {
    generateDNAStrands
};

module.exports = functions;