// Example: Testing the tag-based cache revalidation

// Test 1: Revalidate specific lyrics
async function testRevalidateLyrics() {
  const response = await fetch("http://localhost:3000/api/revalidate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: "507f1f77bcf86cd799439011", // Replace with actual lyrics ID
      type: "lyrics",
    }),
  });

  const data = await response.json();
  console.log("Revalidate lyrics:", data);
}

// Test 2: Revalidate specific artist
async function testRevalidateArtist() {
  const response = await fetch("http://localhost:3000/api/revalidate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      artist: "kakhanang",
      type: "artist",
    }),
  });

  const data = await response.json();
  console.log("Revalidate artist:", data);
}

// Test 3: Revalidate both
async function testRevalidateBoth() {
  const response = await fetch("http://localhost:3000/api/revalidate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      artist: "kakhanang",
      id: "507f1f77bcf86cd799439011",
      type: "lyrics",
    }),
  });

  const data = await response.json();
  console.log("Revalidate both:", data);
}

// Test 4: Revalidate all lyrics
async function testRevalidateAllLyrics() {
  const response = await fetch("http://localhost:3000/api/revalidate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "lyrics",
    }),
  });

  const data = await response.json();
  console.log("Revalidate all lyrics:", data);
}

// Run tests (uncomment to use)
// testRevalidateLyrics();
// testRevalidateArtist();
// testRevalidateBoth();
// testRevalidateAllLyrics();

export {
  testRevalidateLyrics,
  testRevalidateArtist,
  testRevalidateBoth,
  testRevalidateAllLyrics,
};
