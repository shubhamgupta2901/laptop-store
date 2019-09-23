const express = require('express');
const path = require('path');
const app = express();
const hbs = require('hbs');


const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath =  path.join(__dirname,'../templates/partials');


//Setting handlebars engine to express 
app.set('view engine', 'hbs');
//Changing the views directory of hbs from project/views to project/templates/views
app.set('views', viewsPath);
//registering the hbs partials directory
hbs.registerPartials(partialsPath);

// Serve static content for the app from the “public” directory in the application directory
app.use(express.static(publicDirectoryPath));


app.get('',(req,res)=>{
    res.send('Laptop Store')
})

app.get('/products', (req,res) =>{
    res.render('overview',{});
});


app.listen(3000, ()=>{
    console.log('Server is up on port 3000');
})