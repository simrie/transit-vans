"use strict";

/*
    Object definition for a van run.
 */

const vanRunId;
const firstStopTimeStamp;
const firstStopRideObject;
const endEstimateTimestamp;
const endDestination;
const endActualTimestamp;
const runTimeEstimate;
const passengerPointsEstimate;

const rideOrder = [];

const vanRun = {
    vanRunId,
    rideOrder,
    firstStopTimeStamp,
    firstStopRideObject,
    endEstimateTimestamp,
    endDestination,
    endActualTimestamp,
    runTimeEstimate,
    passengerPointsEstimate
};

module.exports = vanRun;


