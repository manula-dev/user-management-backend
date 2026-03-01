/*import "dotenv/config";
import { createServer} from "./app.js";

const server = createServer();
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("Server started successfully!");
});
  // Server startup logic here
    //console.log("Server started successfully!");

  // Additional server setup or middleware can go here */
  process.on("unhandledRejection", err => {
  console.error("UNHANDLED REJECTION:", err);
});

process.on("uncaughtException", err => {
  console.error("UNCAUGHT EXCEPTION:", err);
});
import "dotenv/config";
import { createServer } from "./app.js";

const server = createServer();
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Server started successfully!");
});
