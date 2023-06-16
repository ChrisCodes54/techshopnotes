const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


//GET method
const getAllUsers = asyncHandler(async (req, res) => {

})

//POST method
const createNewUser = asyncHandler(async (req, res) => {

})


//patch method
const updateUser = asyncHandler(async (req, res) => {

})

//delete method
const deleteUser = asyncHandler(async (req, res) => {

})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}