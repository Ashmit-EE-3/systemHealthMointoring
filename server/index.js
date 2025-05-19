const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const systemRouter = require('./router/system.router');

const app = express();
dotenv.config(); 

const mongoURI = process.env.MONGO_URI; 
const port = 3000 ; 
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

app.use(cors());
mongoose.connect(mongoURI, options)
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch((err)=>{
    console.log('Error connecting to MongoDB', err.message);
})

app.use(express.json());
app.use('/api/v1/system', systemRouter); 
app.get('/test', (req,res)=>{
    res.send('Server is running');
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});
