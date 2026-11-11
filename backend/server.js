const http = require("http");

const { Pool } = require("pg");

const fs = require("fs");



const password = fs.readFileSync(

  "/run/secrets/app_password",

  "utf8"

).trim();



const pool = new Pool({

  host: "database",

  port: 5432,

  database: "foodtracker",

  user: "foodtracker_app",

  password: password,

});



const server = http.createServer(async (req, res) => {

  if (req.url === "/health") {

    try {

      await pool.query("SELECT 1");



      res.writeHead(200, {

        "Content-Type": "application/json",

      });



      res.end(JSON.stringify({

        status: "healthy",

        database: "connected",

      }));

    } catch (error) {

      console.error("Database connection failed");

      res.writeHead(503);

      res.end(JSON.stringify({

        status: "unhealthy",

      }));

    }



    return;

  }



  res.writeHead(200, {

    "Content-Type": "application/json",

  });



  res.end(JSON.stringify({

    message: "FoodTracker backend is running",

  }));

});
