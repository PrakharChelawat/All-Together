const express= require('express')
const app= express()
const mongoose=require('mongoose')
const PORT=process.env.PORT || 5000
const {MONGOURI} = require('./config/keys')



//YvSLQsRPM8If0119
mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    // console.log("Connected successfully")
    console.log("Connecting to DB")
})
mongoose.connection.on('error',(err)=>{
    console.log("error connecting",err)
})
require('./models/user.js')
require('./models/post')
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require("path")
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


app.listen(PORT,()=>{
    //call back function
    console.log("server is Running on ",PORT);
})