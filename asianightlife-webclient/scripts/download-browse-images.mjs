import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/browse");

const u = (id, w = 800) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop&ixlib=rb-4.1.0`;

/** Curated Unsplash photo IDs — nightlife / city / travel */
const IMAGES = {
  // Shared fallbacks
  "default": u("1516997121675-4c2d1684aa3e"),
  "all-countries": u("1517457373958-b7bdd4587205"),

  // Countries — landmark / skyline photos
  "countries/singapore": u("1525625293386-3f8f99389edd"), // Marina Bay
  "countries/vietnam": u("1742103264787-ddf8c24f3f72"), // HCMC Bitexco
  "countries/thailand": u("1523731407965-2430cd12f5e4"), // Bangkok skyline
  "countries/malaysia": u("1533118673680-d7eaa85beb24"), // Petronas Towers
  "countries/indonesia": u("1548919973-5cef591cdbc9"), // Jakarta skyline
  "countries/cambodia": u("1566706546199-a93ba33ce9f7"), // Angkor Wat
  "countries/japan": u("1540959733332-eab4deabeeaf"), // Tokyo
  "countries/macao": u("1747582437136-1e97cd696703"), // Macau Tower
  "countries/philippines": u("1581216340441-d47cad9210a4"), // Manila skyline
  "countries/south-korea": u("1559827260-dc66d52bef19"), // Seoul
  "countries/taiwan": u("1601534621622-8587a8a0da11"), // Taipei 101

  // Cities
  "cities/singapore": u("1525625293386-3f8f99389edd"),
  "cities/ho-chi-minh-city": u("1742103264787-ddf8c24f3f72"),
  "cities/bangkok": u("1523731407965-2430cd12f5e4"),
  "cities/jakarta": u("1548919973-5cef591cdbc9"),
  "cities/hanoi": u("1687677185312-10eb98cc1c35"), // Hanoi / HCMC night skyline
  "cities/nha-trang": u("1552465011-b4e21bf6e79a"), // Thai beach (nearest coastal)
  "cities/can-tho": u("1766066826243-4d602996f81a"), // Vietnam river city night
  "cities/kuala-lumpur": u("1533118673680-d7eaa85beb24"),
  "cities/taipei": u("1601534621622-8587a8a0da11"),
  "cities/tokyo": u("1540959733332-eab4deabeeaf"),
  "cities/seoul": u("1559827260-dc66d52bef19"),
  "cities/shanghai": u("1516450360452-9312f5e86fc7"),
  "cities/manila": u("1652432155524-bd2c5c444ce6"),
  "cities/pattaya": u("1568508432206-7541b535f84c"),
  "cities/phnom-penh": u("1566706546199-a93ba33ce9f7"),
  "cities/danang": u("1768691236921-6fde59138a52"),
  "cities/chiang-mai": u("1571845358026-95ef0b176d56"),
  "cities/phuket": u("1552465011-b4e21bf6e79a"),
  "cities/penang": u("1576506730652-f0e4ad14828f"), // KL night (Penang fallback)
  "cities/johor-bahru": u("1525625293386-3f8f99389edd"),
  "cities/kuching": u("1506905925346-21bda4d32df4"),
  "cities/kota-kinabalu": u("1506905925346-21bda4d32df4"),
  "cities/all-cities": u("1516997121675-4c2d1684aa3e"),

  // Categories
  "categories/all": u("1517457373958-b7bdd4587205"),
  "categories/ktv": u("1738156793840-e7ad46384761"),
  "categories/nightclub": u("1570872626485-d8ffea69f463"),
  "categories/live-house": u("1656283384093-1e227e621fad"),
  "categories/pub": u("1514933651103-005eec06c04b"),
  "categories/lounge": u("1470337458703-46ad1756a187"),
  "categories/sky-bar": u("1517457373958-b7bdd4587205"),
  "categories/night-market": u("1555939594-58d7cb561ad1"),
  "categories/spa": u("1544161515-4ab6ce6db874"),
  "categories/massage": u("1519823551278-64ac92734fb1"),
  "categories/hotel": u("1566073771259-6a8506099945"),
  "categories/restaurants": u("1414235077428-338989a2e8c0"),
  "categories/breakfast": u("1533089860892-a7c6f0a88666"),
  "categories/supper": u("1504674900247-0877df9cc836"),
};

async function downloadOne(name, url) {
  const file = path.join(outDir, `${name}.jpg`);
  fs.mkdirSync(path.dirname(file), { recursive: true });

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "asianightlife-image-fetch/1.0" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1000) throw new Error(`too small (${buf.length}b)`);
    fs.writeFileSync(file, buf);
    return { ok: true, size: buf.length };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

async function main() {
  let ok = 0;
  let fail = 0;
  let defaultBuf = null;

  for (const [name, url] of Object.entries(IMAGES)) {
    const result = await downloadOne(name, url);
    if (result.ok) {
      ok++;
      console.log(`OK  ${name} (${result.size}b)`);
      if (name === "default") {
        defaultBuf = fs.readFileSync(path.join(outDir, "default.jpg"));
      }
    } else {
      fail++;
      console.log(`FAIL ${name}: ${result.error}`);
    }
  }

  if (defaultBuf) {
    for (const [name] of Object.entries(IMAGES)) {
      const file = path.join(outDir, `${name}.jpg`);
      if (!fs.existsSync(file)) {
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, defaultBuf);
        console.log(`FALLBACK ${name}`);
        ok++;
        fail--;
      }
    }
  }

  console.log(`\nDone: ${ok} ok, ${fail} failed`);
}

main();
