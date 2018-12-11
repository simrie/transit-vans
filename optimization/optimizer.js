"use strict";

/*
    The optimizer looks at all rides requested and
    attempts to bundle them by:
        majorDestinationObject
        and requestedArrivalTime

    Additional pickups are added in based on
        location proximity to an existing route
        requestedPickupTime or
        requestedArrivalTime

    Any ride dropoff location might be
        destinated as a majorDestinationObject

 */