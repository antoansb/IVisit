const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordinatesForAddress = require('../util/location');
const Place = require('../models/place');

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'zgradica haha',
        location: {
            lat: 40.7484474,
            lng: -73.871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
];

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
         place = await Place.findById(placeId);
    }
    catch(err) {
        const error = new HttpError('Place not found', 500);
        return next(error);
    }

    if(!place) {
        const error =  new HttpError('No place for this id.', 404);
        return next(error);
    }
    

    res.json({place: place.toObject({ getters: true })  });
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let places;
    try {
        places = await Place.find({ creator: userId });
    }
    catch(err) {
        const error = new HttpError('Could not get a place', 500);
        return next(error);
    }
 
    if(!places || places.length === 0) {
        return next (new HttpError('No places for this user id.', 404));
    }

    res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        throw new HttpError('Invalid input.' ,422);
    }

    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = getCoordinatesForAddress(address);
    }
    catch (err) {
        const error = new HttpError('Coordinates not found', 500);
        return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://pbs.twimg.com/profile_images/959452636037730304/tyNdnk5v_400x400.jpg',
        creator
    });

    try {
        await createdPlace.save();
    }
    catch (err) {
        const error = new HttpError('Failed, try again.', 500);
        return next(error);
    }

    res.status(201).json({place: createdPlace});
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        throw new HttpError('Invalid input.' ,422);
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    }
    catch(err) {
        const error = new HttpError('Cold not update.', 500);
        return next(error);
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    }
    catch(err) {
        const error = new HttpError('Could not update.', 500);
        return next(error);
    }

    res.status(200).json({place: place.toObject({ getters: true }) });

};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
    }
    catch(err) {
        const error = new HttpError('Could not delete place', 500);
        return next(error);
    }

    try {
        await place.remove();
    }
    catch(err) {
        const error = new HttpError('Could not delete place', 500);
        return next(error);
    }

    res.status(200).json({message: 'Deleted.'});
};


exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;