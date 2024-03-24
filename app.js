import express from "express";
import fetch from "node-fetch";
const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");

// Define route to fetch and render wanted criminals
app.get("/", async (req, res) => {
  try {
    // Fetch data from the API
    const response = await fetch("https://api.fbi.gov/wanted/v1/list");
    const data = await response.json();

    // Render index.ejs template with the fetched data
    res.render("index", { criminals: data.items });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

// Define route to fetch and render details of a specific criminal
app.get("/criminal/:id", async (req, res) => {
  const criminalId = req.params.id;
  try {
    // Fetch data from the API
    const response = await fetch("https://api.fbi.gov/wanted/v1/list");
    const data = await response.json();

    // Find the criminal with the specified ID
    const criminal = data.items.find((criminal) => criminal.uid === criminalId);

    // Render criminal-details.ejs template with the fetched data
    res.render("criminal-details", { criminal });
    console.log(criminal);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
