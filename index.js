import { http } from "@ampt/sdk";
import express, { Router } from "express";
import { v4 as uuidv4 } from "uuid";
const app = express();

const api = Router();

const dataStore = {
  users: [],
  products: [],
  productGoodsTag:[],
};


api.get("/hello", (req, res) => {
  return res.status(200).send({ message: "Hello from the public api!" });
});

api.get("/greet/:name", (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(400).send({ message: "Missing route param for `name`!" });
  }

  return res.status(200).send({ message: `Hello ${name}!` });
});

api.post("/submit", async (req, res) => {

  return res.status(200).send({
    body: req.body,
    message: "You just posted data",
  });
});

api.post("/create/user", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send({ message: "Name and email are required fields!" });
  }

  const newUser = { name, email };
  dataStore.users.push(newUser);

  return res.status(201).send({ message: "User created successfully", user: newUser });
});

api.post("/create/product", (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).send({ message: "Name and description are required fields!" });
  }

  const productId = uuidv4(); // Генеруємо унікальний ідентифікатор
  const newProduct = { id: productId, name, description }; // Додаємо ідентифікатор до продукту
  dataStore.products.push(newProduct);

  return res.status(201).send({ message: "Product created successfully", product: newProduct });
});

api.post("/create/product/goodstag", (req, res) => {
  const { productId } = req.body;

  const product = dataStore.products.find(value => value.id===productId)

  const productIdGoodsTag = uuidv4();
  const newProduct = { idGoodsTag: productIdGoodsTag, name:product.name, description:product.description,idProductDatabase:productId }; // Додаємо ідентифікатор до продукту
  dataStore.productGoodsTag.push(newProduct);

  return res.status(201).send({ message: "Product in goodstag created successfully", product: newProduct });
});


api.put("/update/product/:id", (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).send({ message: "Name and description are required fields!" });
  }

  const productIndex = dataStore.products.findIndex(product => product.id === id);

  if (productIndex === -1) {
    return res.status(404).send({ message: "Product not found" });
  }

  dataStore.products[productIndex] = { ...dataStore.products[productIndex], name, description };

  return res.status(200).send({ message: "Product updated successfully", product: dataStore.products[productIndex] });
});


api.put("/update/product/goodstag/:id", (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).send({ message: "Name and description are required fields!" });
  }

  const productIndex = dataStore.products.findIndex(product => product.idProductDatabase === id);

  if (productIndex === -1) {
    return res.status(404).send({ message: "Product not found" });
  }

  dataStore.products[productIndex] = { ...dataStore.products[productIndex], name, description };

  return res.status(200).send({ message: "Product in goodstag updated successfully", product: dataStore.products[productIndex] });
});


api.get("/products", (req, res) => {
  return res.status(200).send({ products: dataStore.products });
});

api.get("/products/goodstag", (req, res) => {
  return res.status(200).send({ products: dataStore.productGoodsTag });
});
app.use("/api", api);

http.node.use(app);
