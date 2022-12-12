const express = require('express')
const fs = require("fs");
const bodyParser = require("body-parser")
const uniqid = require('uniqid'); 
const sanitizeHtml = require('sanitize-html');

const dataFile = "./data/players.json";
const port = 3000

const app = express()

//get product by id
app.get('/players/:id', function (req, res) {
    let id = req.params.id;

    //beolvassuk az összes adatot: json -> obj
    fs.readFile(dataFile, (error, data)=>{
        let players = JSON.parse(data);

        //megkeressük a megfelelő product-ot id alján
        const playersById = players.find(player => player.id === id)
        if (!playersById) {
            // nincs meg
            let message = {
                error: `id: ${id} not found`
            };
            res.status(404);
            res.send(message);
            return;
        }
        //visszaküldjük
        res.send(playersById);
    });
})

//get products
app.get('/players', function (req, res) {
    fs.readFile(dataFile, (error, data)=>{
        let players = data;
        res.send(players);
    });
})


//delete product by id
app.delete('/products/:id', function (req, res) {
    let id = req.params.id;

    //beolvassuk az összes adatot: json -> obj
    fs.readFile(dataFile, (error, data)=>{
        let products = JSON.parse(data);

        //megkeressük a megfelelő product indexét id alján
        const productsIndexById = products.findIndex(product => product.id === id)

        if (productsIndexById === -1) {
            // nincs meg
            let message = {
                error: `id: ${id} not found`
            };
            res.status(404);
            res.send(message);
            return;
        }
        //letöröljük
        products.splice(productsIndexById, 1);

        //visszaír: obj -> json
        products = JSON.stringify(products)
        fs.writeFile(dataFile, products, (error)=>{
            console.log(error);
            //visszaküldjük, hogy melyik id-t töröltük
            res.send({id: id});
        })
    });
})

//put product by id
app.put('/products/:id', bodyParser.json(),function (req, res) {
    let id = req.params.id;
    let putProduct = {
        id: id, 
        name: sanitizeHtml(req.body.name),
        quantity: req.body.quantity,
        price: req.body.price,
        type: sanitizeHtml(req.body.type)
    }
    //beolvassuk az összes adatot: json -> obj
    fs.readFile(dataFile, (error, data)=>{
        let products = JSON.parse(data);

        //megkeressük a megfelelő product indexét id alján
        const productsIndexById = products.findIndex(product => product.id === id)

        if (productsIndexById === -1) {
            // nincs meg
            let message = {
                error: `id: ${id} not found`
            };
            res.status(404);
            res.send(message);
            return;
        }
        //felülírjuk
        products[productsIndexById] = putProduct;

        //visszaír: obj -> json
        products = JSON.stringify(products)
        fs.writeFile(dataFile, products, (error)=>{
            console.log(error);
            //visszaküldjük, a módosított rekordot
            res.send(putProduct);
        })
    });
})

//post
app.post('/players',bodyParser.json(), function (req, res) {
    let newPlayer = {  
        id: uniqid(), 
        name: sanitizeHtml(req.body.name),
        qualification: req.body.qualification, 
        position: req.body.position, 
        club: req.body.club, 
        age: req.body.age, 
        nationality: req.body.nationality 
    }

    
    fs.readFile(dataFile,(error, data)=>{
        //beolvas, json -> obj
        let players = JSON.parse(data);
        //push
        players.push(newPlayer);
        //visszaír: obj -> json
        players = JSON.stringify(players)
        fs.writeFile(dataFile, players, (error)=>{
            console.log(error);
            res.send(newPlayer);
        })

    })

})

app.listen(port)

//<script>alert('betörtem')</scrip>