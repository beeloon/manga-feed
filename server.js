const express = require('express');
const path = require('path');

const app = express();
const PUBLIC = path.join(__dirname, 'public');

app.use(express.static(PUBLIC));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Manga Feed MVP — http://localhost:${port}`);
  console.log(`  /        landing`);
  console.log(`  /folio   reading library design`);
  console.log(`  /riso    risograph zine design`);
  console.log(`  /beach   beachRead editorial portal design`);
});
