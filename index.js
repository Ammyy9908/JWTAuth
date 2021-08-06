const express = require('express');
const auth_route = require('./routes/AuthRoute');
const mongoose  = require('mongoose');

const app = express();
app.use(express.json())
app.use('/auth',auth_route);


//connect to db

mongoose.connect('mongodb://127.0.0.1:27017/auth',{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log('Database connected!');
}).catch((e)=>console.log(error));


const port = process.env.PORT || 5000;


app.listen(port,()=>{
    console.log(`Application running on ${port}`);
})