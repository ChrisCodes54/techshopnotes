const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { response } = require('express')


//GET method
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if(!users) {
        return res.status(400).json({message: 'No users found'})
    } 
    res.json(users)
})

//POST method
const createNewUser = asyncHandler(async (req, res) => {
    const {username, password, roles}= req.body

    if(!username || !password || !Array.isArray(roles) || !roles.length) {
return res.status(400).json({message: 'All fields are required'})
    }
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