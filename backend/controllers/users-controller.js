const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Lazar',
        email: 'laza@gmail.com',
        password: 'lazar'
    }
];

const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS });
};

const register = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        throw new HttpError('Invalid input.' ,422);
    }

    const {name, email, password } = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email);
    if(hasUser) {
        throw new HttpError('Email already exists.', 422);
    }

    const createdUser = {
        id: uuid(),
        name,
        email,
        password
    };

    DUMMY_USERS.push(createdUser);

    res.status(201).json({user: createdUser});
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if(!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('User not found.', 401);
    }
    
    res.json({message: 'Logged in.'});
};

exports.getUsers = getUsers;
exports.register = register;
exports.login = login;