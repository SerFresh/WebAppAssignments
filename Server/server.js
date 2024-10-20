const express = require("express");
const axios = require("axios"); // For HTTP requests to external servers
const app = express();
const PORT = 8000;

// Middleware to parse JSON body
app.use(express.json());

// GET /configs/:id - Fetch drone configuration
app.get("/configs/5", async (req, res) => {

  try {
    // Fetch the drone configuration from the external server
    const configResponse = await axios.get(`https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec?id=${id}`);
    const config = configResponse.data;

    // Handling max_speed as per the requirements
    if (config.max_speed > 110) {
      config.max_speed = 110;
    } else if (!config.max_speed) {
      config.max_speed = 100;
    }

    // Responding with the modified or original configuration
    res.send(config);
  } catch (error) {
    res.status(500).send({ error: "Error fetching drone config" });
  }
});

// GET /status/:id - Return the drone status (static for now)
app.get("/status/:id", (req, res) => {
  const id = req.params.id;
  res.send({ condition: "good" });
});

// GET /logs - Fetch drone logs
app.get("/logs", async (req, res) => {
  try {
    // Fetching logs from the external Drone Log Server
    const logsResponse = await axios.get("https://app-tracking.pockethost.io/api/collections/drone_logs/records");
    res.send(logsResponse.data);

  } catch (error) {
    res.status(500).send({ error: "Error fetching drone logs" });
  }
});

// POST /logs - Create a new log entry
app.post("/logs", async (req, res) => {
  const newLog = req.body;

  console.log('Received log:', newLog);

  res.status(500).json({ message: 'Created successfully', log: newLog });
});

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
