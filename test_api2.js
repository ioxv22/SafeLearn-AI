const url = 'http://de3.bot-hosting.net:21007/kilwa-video?text=hacker';
fetch(url)
  .then(res => res.text())
  .then(text => console.log("BODY:", text))
  .catch(err => console.error(err));
