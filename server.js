const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY || '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',
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Get all profiles
app.get('/api/profiles', async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID || '1d9b1628346f807196e9d5375dda4eab',
      sorts: [
        {
          property: "Name",
          direction: "ascending",
        },
      ],
    });
    res.json(response.results);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// Create a profile
app.post('/api/profiles', async (req, res) => {
  try {
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID || '1d9b1628346f807196e9d5375dda4eab' },
      properties: req.body.properties,
    });
    res.json(response);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// Update a profile
app.put('/api/profiles/:id', async (req, res) => {
  try {
    const response = await notion.pages.update({
      page_id: req.params.id,
      properties: req.body.properties,
    });
    res.json(response);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Delete a profile
app.delete('/api/profiles/:id', async (req, res) => {
  try {
    const response = await notion.pages.update({
      page_id: req.params.id,
      archived: true,
    });
    res.json(response);
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 