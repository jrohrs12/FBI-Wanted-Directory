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
    console.error("Error fetching data:", res);
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

    // Convert height from inches to feet and inches
    criminal.height_min = convertToFeetAndInches(criminal.height_min);
    criminal.height_max = convertToFeetAndInches(criminal.height_max);

    // Process text containing links
    if (criminal.caution) {
      criminal.caution = processLinksInText(criminal.caution);
    }

    if (criminal.details) {
      criminal.details = processLinksInText(criminal.details);
    }

    // Render criminal-details.ejs template with the fetched data
    res.render("criminal-details", { criminal });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

// Function to convert inches to feet and inches
function convertToFeetAndInches(inches) {
  if (inches === null) return "NA";

  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;

  if (feet === 0) {
    return `${remainingInches} inches`;
  } else if (remainingInches === 0) {
    return `${feet} feet`;
  } else {
    return `${feet} feet ${remainingInches} inches`;
  }
}

// Function to process text containing links
function processLinksInText(text) {
  // Replace links in the text with the inner text of the anchor tags
  return text.replace(/<a.*?>(.*?)<\/a>/g, "$1");
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
