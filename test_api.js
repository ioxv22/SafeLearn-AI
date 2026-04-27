async function testApi() {
  const payload = {
    prompt: "Gentle motion on clouds",
    model: "Seedance 1.0 Lite",
    duration: 5,
    aspect_ratio: "16:9"
  };
  
  try {
    const response = await fetch('https://zecora0.serv00.net/ai/Seedance.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    console.log("RESPONSE:", text);
  } catch(e) {
    console.error(e);
  }
}
testApi();
