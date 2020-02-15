const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');


const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    }
    catch (err) {
        const error = new HttpError('Could not get users.', 500);
        return next(error);
    }

    res.json({ users: users.map(user => user.toObject({ getters: true })) });

};

const register = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid input.' ,422)); 
    }

    const {name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email:email });
    }
    catch(err) {
        const error = new HttpError('Register failed.', 422);
        return next(error);
    }

    if(existingUser) {
        const error = new HttpError('User already exists.', 500);
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        image: 'https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/6/63/97d1d9f934a350cee765c5ac1a466605.jpg/revision/latest/top-crop/width/360/height/360?cb=20190527184444',
        password,
        places: []
    });

    try {
        await createdUser.save();
    }
    catch (err) {
        const error = new HttpError('Register failed, try again.', 500);
        return next(error);
    }

    res.status(201).json({user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    }
    catch(err) {
        const error = new HttpError('Login failed.', 500);
        return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError('Cold not login.', 401);
        return next(error);
    }
    
    res.json({message: 'Logged in.'});
};

exports.getUsers = getUsers;
exports.register = register;
exports.login = login;