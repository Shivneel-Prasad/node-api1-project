// BUILD YOUR SERVER HERE

// IMPORTS AT THE TOP
const express = require('express')
const User = require('./users/model')

// INSTANCE OF EXPRESS APP
const server = express()

// GLOBAL MIDDLEWARE
server.use(express.json())

// ENDPOINTS
server.post('/api/users', async (req, res) => {
    console.log(req.body);
    try {
        const { name, bio } = req.body
        if (!name || !bio) { // if it is not true then it will send an error message
            res.status(400).json({
                status: 400,
                message: 'Please provide name and bio for the user'
            })
        } else { // if it's not false then it will add a new User
            const { name, bio } = req.body
            const addUser = await User.insert({ name, bio })
                res.status(201).json(addUser)
        }

    } catch (error) { // it will only occur if 
        res.status(500).json({
            status: 500,
            message: 'There was an error while saving the user to the database',
        })
    }
})

server.get('/api/users', async (req, res) => {
    try {
        const allUsers = await User.find()
          res.json(allUsers)
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'The users information could not be retrieved',
        })
    }
})

server.get('/api/users/:id', async (req, res) => {
    try { // if user is not found it will show an error otherwise it will display user info
        const { id } = req.params
        const findUser = await User.findById(id)
          if (!findUser) { 
              res.status(404).json({ 
                  status: 404,
                  message: 'The user with the specified ID does not exist'
            })
          } else {
              res.status(200).json(findUser)
          }
    } catch (err) { 
        res.status(500).json({
            status: 500,
            message: 'The user information could not be retrieved',
        })
    }
})

server.delete('/api/users/:id', async (req, res) => { 
    try { 
        const discardUser = await User.remove(req.params.id)
        if (!discardUser) {
            res.status(404).json({ 
                status: 404,
                message: 'The user with the specified ID does not exist'
            })
        } else {
            res.json(discardUser)
        }
    } catch (err) { 
        res.status(500).json({
            status: 500,
            message: 'The user could not be removed',
        })
    }
})

server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params
    const { name, bio } = req.body
    console.log(name, bio)
    try {
        const updateUser = await User.update(id, { name, bio })
        if (!updateUser) {
            res.status(404).json({ 
                status: 404,
                message: 'The user with the specified ID does not exist'
            })
        } else if (!name || !bio) {
            res.status(400).json({
                status: 400,
                message: 'Please provide name and bio for the user'
            })
        } else {
            res.status(200).json(updateUser)
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: 'The user information could not be modified',
        })
    }
})

module.exports = server;
