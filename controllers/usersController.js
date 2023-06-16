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
//here we will check for any duplicate usernames to ensure no one can sign up with the same username
    const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate) {
        return res.status(409).json({message: 'Duplicate Username'})
    }

    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10)

    const userObject = {username, 'password': hashedPassword, roles}

    //create and save new user
    const user = await user.create(userObject)

    if(user) {
        res.status(201).json({message: `New user ${username} created!`})
    } else {
        res.status(400).json({message:'Inavlid user data received'})
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