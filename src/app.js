// DNS workaround for the SRV lookup error on your PC.
// Keep these two lines because your MongoDB connection worked after adding them.
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const productRoutes = require("./routes/productRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("Inventory Management API is running"));
app.use("/api/products", productRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
