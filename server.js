//Improt externall packages - CommonJS
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { request } = require("http");
const { response } = require("express");

//Creating my server
const app = express();

// Install the body-parser middleware
//Allow us to read json from requests
app.use(bodyParser.json());

//Read in JSSON FILE (MOCK database)
let products = [];

try {
  products = JSON.parse(fs.readFileSync("products.json")).products;
} catch (error) {
  console.log("No existing file.");
}

//Defining our HTTP Resourse Methods
//API Endpoints
//Routes

//GET ALL PRODUCTS
//GET //api/products
app.get("/api/products", (request, response) => {
  response.send(products);
});

//GET A SPECIFIC PRODUCT BY ID
//GET /api/products/:id
app.get("/api/products/:id", (request, response) => {
  //Number is a global function by js for strings to numbers
  const productId = Number(request.params.id);

  const product = products.find((p) => {
    if (productId === p.id) {
      return true;
    }
  });

  // product = undefined  will equal false
  //!undefined is !false = true

  if (!product) {
    response.send(`Product with id ${productId} not found`);
    return;
  }

  response.send(product);
});
//CREATE A NEW PRODUCT
//POST / api/products {id:"123", name:"Apples", price: 1.99}
app.post("/api/products", (request, response) => {
  //read the json body from the request
  const body = request.body;
  console.log(body);
  //validate the json body to have required properties
  /*Required Properties:
  -id
  -name
  -price
  */
  if (!body.id || !body.name || !body.price) {
    response.send("Bad request. Validation Error. Missing id,name or price!");
    return;
  }
  //add the new product to our existing products array

  products.push(body);

  //commit the new proudcts array to the data base(json file)
  const jsonPayLoad = {
    products,
  };
  fs.writeFileSync("products.json", JSON.stringify(jsonPayLoad));

  response.send();
});
//UPDATE EXISTING PRODUCT BY ID
//PUT /api/products/:id   {id:"123", name:"Apples", price: 5.99}
app.put("/api/products/:id", (request, response) => {
  const productId = Number(request.params.id);

  const product = products.find((p) => {
    return productId === p.id;
  });
  if (!product) {
    response.send(`Product with id ${productId} not found.`);
    return;
  }

  const body = request.body;

  if (body.name) {
    product.name = body.name;
  }
  if (body.price) {
    product.price = body.price;
  }

  const jsonPayload = {
    products: products,
  };
  fs.writeFileSync("products.json", JSON.stringify(jsonPayload));

  response.send();
});
//DELETE EXISTING PRODUCT BY ID
//DELETE /api/products:id
app.delete("/api/products/:id", (request, response) => {
  const productId = Number(request.params.id);

  const productIndex = products.findIndex((p) => {
    return productId === p.id;
  });

  if (productIndex === -1) {
    response.send(`Product with ID ${productId} not found.`);
    return;
  }

  products.splice(productIndex, 1);

  const jsonPayLoad = {
    products: products,
  };
  fs.writeFileSync("products.json", JSON.stringify(jsonPayLoad));

  response.send();
});

//Starting My Server
const port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port, () => {
  console.log("Grocery API Server Started!");
});
