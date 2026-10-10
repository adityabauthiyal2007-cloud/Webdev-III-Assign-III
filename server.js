require("dotenv").config();
const app = require("./src/app");
const connectDatabase = require("./src/config/database");

const PORT = Number(process.env.PORT) || 8080;

async function startServer() {
  await connectDatabase();
  app.listen(PORT, () => console.log(`Inventory API is running on port ${PORT}`));
}

startServer().catch((error) => {
  console.error("Unable to start the server:", error.message);
  process.exit(1);
});
