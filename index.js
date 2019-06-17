const fs = require('fs');
const http = require('http');
const url = require('url');


//Accessing data.json file from file system and parsing it to a javascript object
//In nodejs there are some operations which have both synchronus as well as asynchronus methods avaialable  like reading a file from filesystem
// A synchronous method is blocking that means all the work ahead it will be blocked till the work of synchronous method is finished.  This will block other users too.
// While asynchronous method will keep on working in background and will invoke a callback function which we pass once it is finished
//The idea behind reading the file synchronously is that this rile read happens only once when the server is started.
//While in methods accessible by multiple clients like business logic of routes handling, we need to use async methods so that other users are not blocked while one of the users is performing such an action.
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

//Creating the server
//The method takes a callback function which has access to request and response.
//Everytime somebody tries to access the server, this callback function would be called.
const server = http.createServer((request, response)=>{
    //console.log('Someone accessed the server');
    const pathname = url.parse(request.url, true).pathname;
    const id = url.parse(request.url,true).query.id;
    console.log(pathname);
    //Routing: we respond in different ways to different URLs. Its important to note here is that nodejs treats all the images used in the html as requests, so we need to route them as well.
    if(pathname === '/products' || pathname === '/'){
        response.writeHead(200, {'Content-type': 'text/html'})
        fs.readFile(`${__dirname}/templates/template_overview.html`, 'utf-8',(err, data)=>{
            let overviewhtml = data;
            fs.readFile(`${__dirname}/templates/template_card.html`, 'utf-8',(err,data)=>{
                let cardhtml = data;
                response.end(renderOverviewHTML(laptopData, overviewhtml, cardhtml));
            })
        })
        
    }else if(pathname === '/laptop' && id<laptopData.length){
        response.writeHead(200, {'Content-type': 'text/html'})
        
        fs.readFile(`${__dirname}/templates/template_laptop.html`, 'utf-8',(err, data)=>{
            const laptop = laptopData[id];
            response.end(renderLaptopHTML(laptop,data));
        })

    }
    //IMAGES
    else if((/\.(jpeg|jpg|png|gif)$/i).test(pathname)){
        fs.readFile(`${__dirname}/data/img${pathname}`,(err, data)=>{
            response.writeHead(200,{'Content-type': 'img/jpg'});
            response.end(data);
        })
    }
    else{
        response.writeHead(404, {'Content-type': 'text/html'})
        response.end('Page not found on server');
    }
    
});


renderOverviewHTML = (laptopArr, overviewhtml, cardhtml)=> {
    const cards = laptopArr.map(laptop => {
        let output = cardhtml;
        output = output.replace('{%PRICE%}',laptop.price);
        output = output.replace('{%IMAGE%}',laptop.image);
        output = output.replace('{%PRODUCTNAME%}',laptop.productName);
        output = output.replace('{%SCREEN%}',laptop.screen);
        output = output.replace('{%CPU%}',laptop.cpu);
        output = output.replace('{%HREF%}',`/laptop?id=${laptop.id}`);
        return output;
    });
    return overviewhtml.replace('{%CARDS%}',cards.join(''));  
}


renderLaptopHTML = (laptop, html)=>{
    let output = html.replace(/{%PRICE%}/g,laptop.price);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRODUCTNAME%}/g,laptop.productName);
    output = output.replace('${%SCREEN%}',laptop.screen);
    output = output.replace('${%CPU%}',laptop.cpu);
    output = output.replace('${%STORAGE%}',laptop.storage);
    output = output.replace('${%RAM%}',laptop.ram);
    output = output.replace('${%DESCRIPTION%}',laptop.description);
    return output;
}


/**
{
        "id": "0",
        "productName": "Huawei MateBook X Pro",
        "image": "huawei-matebook-pro.jpg",
        "cpu": "Intel Core i7, 8th generation",
        "ram": "8GB",
        "storage": "512 GB SSD",
        "screen": "13.9-inch, 3K (3,000 x 2,080)",
        "price": "1499",
        "description": "The Huawei MateBook X Pro is our pick for the best laptop money can buy in 2018. This is a gorgeously-designed laptop with a stunning screen (albeit with a rather odd aspect ratio), and it comes packed with cutting edge components that allows it to perform brilliantly, and a battery life that runs rings around many of its rivals. It also has a very competitive price, giving you features, design and performance for quite a bit less money."
    } 
*/

//This will tell nodejs to always keep listening to a certain port on a certain ip
server.listen(1337, '127.0.0.1', ()=>{
    console.log('Server started listening for request now.')
})