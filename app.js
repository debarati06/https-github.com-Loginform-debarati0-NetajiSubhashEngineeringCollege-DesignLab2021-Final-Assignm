const express = require('express')
const app = express()

const bodyParser = require('body-parser')

const MongoClient = require('mongodb').MongoClient
const url = ("mongodb://127.0.0.1:27017/mean_project")

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))

app.get('/signup', function(req, res){
    res.sendFile(__dirname + "/" + "signup.html")

    
})
    app.post('/signup', function(req, res){
        const reqBody = JSON.stringify(req.body)
        const doc = JSON.parse(reqBody)
        console.log(doc)

        try
        {
            MongoClient.connect(url, function(err, db){
                const dbo = db.db("mean_project")
                dbo.collection("users").insertOne(doc, function(err){
                    db.close()
                    res.sendFile(__dirname + "/" + "signin.html")
                })
            })
        }
        catch
        {
            console.log(err)
            res.end(JSON.stringify({message : "Fail" }))
        }
    })



    app.post('/signin', async function(req, res){
        
        try
        {
            const email = req.body.email
            const password = req.body.password

            MongoClient.connect(url, async function(err, db){
                if(err) throw err
                const dbo = db.db("mean_project")
                const useremail = await dbo.collection("users").findOne({email : email})                                                                                               
                    if(useremail.password === password)
                    {
                        res.send(useremail)
                    }
                    else
                    {
                        res.send("Incorrect email or password")
                    }
            })
        }
        catch
        {
            console.log()
            res.end(JSON.stringify({message : "Fail" }))
        }

    })
    app.get('/signin.html', function(req, res){
        res.sendFile(__dirname + "/" + "signin.html")
    })






app.listen(8000, function(err){
    if (err) throw err
    console.log("Server is running at the Port 8000...!!")
})