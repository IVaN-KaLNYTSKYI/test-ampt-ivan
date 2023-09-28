import { http } from "@ampt/sdk";
import express, { Router } from "express";
import { api } from "@ampt/api";
import { v4 as uuidv4 } from "uuid";
const app = express();

const dataStore = {
  users: [],
  products: [],
  productGoodsTag:[],
};
const publicApi = api("public").router("/api");

publicApi.get("/hello", (event) => {
  return event.status(200).body({ message: "Hello from the public api!" });
});

publicApi.post("/greet/:name", (event) => {
  const { name } = event.params;

  if (!name) {
    return event.status(400).body({ message: "Missing route param for `name`!" });
  }

  return res.status(200).send({ message: `Hello ${name}!` });
});

publicApi.post("/submit", async (event) => {

  return event.status(200).body({
    body: event.request.body(),
    message: "You just posted data",
  });
});

publicApi.post("/create/user", (event) => {
  const { name, email } = event.request.body();

  if (!name || !email) {
    return event.status(400).body({ message: "Name and email are required fields!" });
  }

  const newUser = { name, email };
  dataStore.users.push(newUser);

  return event.status(201).body({ message: "User created successfully", user: newUser });
});

publicApi.post("/create/product", (event) => {
  console.log(event.request.body());
  const { name, description } = event.request.body();

  if (!name || !description) {
    return event.status(400).body({ message: "Name and description are required fields!" });
  }

  const productId = uuidv4(); // Генеруємо унікальний ідентифікатор
  const newProduct = { id: productId, name, description }; // Додаємо ідентифікатор до продукту
  dataStore.products.push(newProduct);

  return event.status(201).body({ message: "Product created successfully", product: newProduct });
});

publicApi.post("/create/product/goodstag", (event) => {
  const { productId } = event.request.body();

  const product = dataStore.products.find(value => value.id===productId)

  const productIdGoodsTag = uuidv4();
  const newProduct = { idGoodsTag: productIdGoodsTag, name:product.name, description:product.description,idProductDatabase:productId }; // Додаємо ідентифікатор до продукту
  dataStore.productGoodsTag.push(newProduct);

  return event.status(201).body({ message: "Product in goodstag created successfully", product: newProduct });
});


publicApi.put("/update/product/:id", (event) => {
  const { id } = event.params;
  const { name, description } = event.request.body();

  if (!name || !description) {
    return event.status(400).body({ message: "Name and description are required fields!" });
  }

  const productIndex = dataStore.products.findIndex(product => product.id === id);

  if (productIndex === -1) {
    return event.status(201).body({ message: "Product not found" });
  }

  dataStore.products[productIndex] = { ...dataStore.products[productIndex], name, description };

  return event.status(200).body({ message: "Product updated successfully", product: dataStore.products[productIndex] });
});


publicApi.put("/update/products/goodstag/:goodstagId", (event) => {
  const { goodstagId } = event.params;
  const { name, description } = event.request.body();

  if (!name || !description) {
    return event.status(400).body({ message: "Name and description are required fields!" });
  }

  const productIndex = dataStore.products.findIndex(product => product.idProductDatabase === goodstagId);

  if (productIndex === -1) {
    return event.status(404).body({ message: "Product not found" });
  }

  dataStore.products[productIndex] = { ...dataStore.products[productIndex], name, description };

  return event.status(200).body({ message: "Product in goodstag updated successfully", product: dataStore.products[productIndex] });
});


publicApi.get("/products", (event) => {
  return event.status(200).body({ products: dataStore.products });
});

publicApi.get("/products/goodstag", (event) => {
  return event.status(200).body({ products: dataStore.productGoodsTag });
});
http.useNodeHandler(app);

http.node.use(app);
