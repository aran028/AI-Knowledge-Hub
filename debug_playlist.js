// Quick debug script to check playlist/tools relationship
const playlistId = "c4f7b623-9016-4084-a9f2-b12427c48699"; // From our earlier data

fetch(`https://ai-knowledge-hub-six.vercel.app/api/tools?playlist=${playlistId}`)
  .then(r => r.json())
  .then(data => {
    console.log(`Playlist ${playlistId}:`);
    console.log('Full response:', JSON.stringify(data, null, 2));
  })
  .catch(err => console.error('Error:', err));