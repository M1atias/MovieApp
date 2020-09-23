const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://matias:reactmovie2020@react-movie.sivun.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority',
    {useNewUrlParser:true}).then(()=> console.log('DB conenected'))
                           .catch(err=>console.error(err));

app.get('/',(req,res)=>{
    res.send('hello world')
});





app.listen(5000);