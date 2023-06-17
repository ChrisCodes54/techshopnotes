const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


//GET method
const getAllUsers = asyncHandler(async (req, res) => {

    const users = await User.find().select('-password').lean()

    if(!users?.length) {
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
    const user = await User.create(userObject)

    if(user) {
        res.status(201).json({message: `New user ${username} created!`})
    } else {
        res.status(400).json({message:'Inavlid user data received'})
    }

})


//patch method
const updateUser = asyncHandler(async (req, res) => {
    const {id, username, roles, active, password} = req.body

    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({message:'All fields except password are required'})
    }

    const user = await User.findById(id).exec()

    if(!user) {
        return res.status(400).json({message: 'User not found'})
    }

    //checking for any duplicate
    const duplicate = await User.findOne({username}).lean().exec()

    if(duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: 'Duplicate username!'})
    }

    user.username = username
    user.roles = roles
    user.active = active

        if(password) {
            //hashing the passoword
            user.password = await bcrypt.hash(password, 10)
        }

        const updatedUser = await user.save()
        res.json({message: `${updatedUser.username} updated`})
})

//delete method
const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.body 

    if(!id) {
        return res.status(400).json({message:'User ID Required!'})
    }

    const notes = await Note.findOne({user: id}).lean().exec()

    if(notes?.length) {
        return res.status(400).jsom({message: 'User has assigned notes'})
    } 

    const user = await user.findById(id).exec()
    if(!user) {
        return res.status(400).json({message: 'User not found'})
    }

    const result = await user.deleteOne() 
    
    const reply = `Username ${result.username} with ID ${result._id} deleted!`

    response.json(reply)

})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}