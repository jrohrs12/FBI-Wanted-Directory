import express from "express";
import fetch from "node-fetch";
const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");

// Add middleware to set MIME type for .js files
// Serve static files from the 'public' directory
app.use(express.static("public"));

// Define route to fetch and render wanted criminals
app.get("/", async (req, res) => {
  try {
    const response = await fetch("https://api.fbi.gov/wanted/v1/list");
    const data = await response.json();
    const totalPages = Math.ceil(data.total / 10); // Calculate total pages based on the total number of items
    const currentPage = 1;

    res.render("index", { criminals: data.items, currentPage, totalPages });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

// Define route to fetch and render details of a specific criminal
app.get("/criminal/:id", async (req, res) => {
  const criminalId = req.params.id;
  try {
    // Fetch data from the API for the specific criminal
    const response = await fetch(
      `https://api.fbi.gov/@wanted-person/${criminalId}`
    );
    const criminal = await response.json();
    console.log(criminal);

    // Render criminal-details.ejs template with the fetched data
    res.render("criminal-details", { criminal });
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
