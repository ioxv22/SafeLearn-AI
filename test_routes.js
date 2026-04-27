const fetch = globalThis.fetch;
async function test() {
  for (const path of ['/kilwa-video', '/video', '/kilwavideo']) {
    try {
      const res = await fetch(`http://de3.bot-hosting.net:21007${path}?text=test`);
      console.log(path, res.status);
    } catch(e){}
  }
}
test();
