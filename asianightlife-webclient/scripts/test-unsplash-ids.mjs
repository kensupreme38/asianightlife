const u = (id) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0`;

const candidates = {
  singapore: [
    "1525625293386-3f8f99389edd",
    "1724211669492-1d55cfaf4c92",
    "1574637654178-f0f7cf6ef814",
  ],
  vietnam: [
    "1583417318770-775d3f0dce47",
    "1559594364-21e8cfea29f0",
    "1528181304801-81f09150b60b",
    "1568846883602-898927c8703a",
    "1508804185872-d1b4b1b1b1b1",
    "1493225457124-a3eb161ffa5f",
  ],
  thailand: [
    "1563492065-00a892892481",
    "1506665531196-69ef52b89cf2",
    "1552465011-b4e21bf6e79a",
    "1516450360452-9312f5e86fc7",
  ],
  malaysia: [
    "1596422846544-e75affb2e8cf",
    "1566073771259-6a8506099945",
    "1517154429931-87335393dfaf",
  ],
  indonesia: [
    "1548919973-5cef591cdbc9",
    "1555899434-94d13685aa9a",
    "1518542304891-86588e489dc9",
  ],
  cambodia: [
    "1578662996442-48f60103fc96",
    "1559592413-7cec9d2e3d88",
    "1539654157877-5889506d96fa",
    "1545569341-9f4f086a47d0",
  ],
  japan: [
    "1540959733332-eab4deabeeaf",
    "1542051841853-314f2237cf70",
    "1493976040374-85c8e12f0c0e",
    "1536097931740-79a1fffb0d11",
  ],
  macao: [
    "1599579852109-94acdd92e749",
    "1517457373958-b7bdd4587205",
    "1565008576549-57569a49316d",
  ],
  philippines: [
    "1518509562904-e7ef8f8d7a85",
    "1548919973-5cef591cdbc9",
    "1517154429931-87335393dfaf",
  ],
  "south-korea": [
    "1517154429931-87335393dfaf",
    "1538485399081-7191377e13f3",
    "1517154429931-87335393dfaf",
    "1559827260-dc66d52bef19",
  ],
  taiwan: [
    "1470003013982-1d5158606e9c",
    "1517154429931-87335393dfaf",
    "1596422846544-e75affb2e8cf",
  ],
};

for (const [loc, ids] of Object.entries(candidates)) {
  for (const id of ids) {
    const res = await fetch(u(id));
    if (res.ok) {
      const buf = await res.arrayBuffer();
      if (buf.byteLength > 8000) {
        console.log(`${loc}: ${id} (${buf.byteLength}b)`);
        break;
      }
    }
  }
}
