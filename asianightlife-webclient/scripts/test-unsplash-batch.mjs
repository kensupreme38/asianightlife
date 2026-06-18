const u = (id) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0`;

const ids = [
  // Vietnam
  "1583417318770-775d3f0dce47", "1559594364-21e8cfea29f0", "1528181304801-81f09150b60b",
  "1568846883602-898927c8703a", "1559592334-9e4b3c8b8f3b", "1508804185872-d1b4b1b1b1b1",
  "1581009133105-66b79c97d903", "1594817318446-ecac9a7a84e4",
  // Thailand Bangkok
  "1563492065-00a892892481", "1506665531196-69ef52b89cf2", "1519451241477-4d324b0e6834",
  "1546412414-4c5c5c5c5c5c", "1558003969-1a0a0a0a0a0a",
  // Malaysia KL
  "1596422846544-e75affb2e8cf", "1517154429931-87335393dfaf", "1508804185872-d1b4b1b1b1b1",
  // Cambodia
  "1566706546199-a93ba33ce9f7", "1559592413-7cec9d2e3d88", "1539654157877-5889506d96fa",
  // Japan
  "1542051841853-314f2237cf70", "1493976040374-85c8e12f0c0e", "1536097931740-79a1fffb0d11",
  // Macao
  "1599579852109-94acdd92e749", "1565008576549-57569a49316d",
  // Philippines
  "1518509562904-e7ef8f8d7a85", "1518542304891-86588e489dc9",
  // Taiwan
  "1470003013982-1d5158606e9c", "1559827260-dc66d52bef19",
  // Indonesia
  "1555899434-94d13685aa9a", "1518542304891-86588e489dc9",
  // Korea
  "1538485399081-7191377e13f3", "1559827260-dc66d52bef19",
];

for (const id of ids) {
  const res = await fetch(u(id));
  if (res.ok) {
    const buf = await res.arrayBuffer();
    if (buf.byteLength > 8000) console.log(`OK ${id} ${buf.byteLength}b`);
    else console.log(`small ${id} ${buf.byteLength}b`);
  } else {
    console.log(`FAIL ${id}`);
  }
}
