//require the library dependencies
const express = require('express')
const app = express()

//incripting library
const bcrypt = require('bcrypt')

//allows the application to accept json
app.use(express.json())

//User const to store users...for our app we need to build a database
const users = [ ];

//Route for getting all users not best practice because it exposes users information
app.get('/users', (req, res) => {
    res.json(users)
});

//Code to create and save users
app.post('/users', async (req, res) => {
    try{
        //this incrypts the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        //creates user information
        const user = { name: req.body.name, password: hashedPassword }
        users.push(user)
        res.status(201).send()
    }catch {
        res.status(500).send()
    }
})

//check person's name and password during login
app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null){
        return res.status(400).send('cannot find user')
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send('Success')
        } else{
            res.send('Not Allowed')
        }
    }catch{
        res.status(500).send()
    }
})

//the app is listening in localhost 3000
app.listen(3000)