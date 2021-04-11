const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const Fuse = require("fuse.js");

const results = [];
const readEntries = () =>
  new Promise((resolve, reject) => {
    fs.createReadStream("28_bootcamp_thanks/bootcamp.csv")
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(results);
      });
  });

const readDim = () => {
  return JSON.parse(fs.readFileSync("dim.json"));
};

const dim = readDim();
const fuseDim = new Fuse(dim, {
  includeScore: true,
  keys: ["name"],
});

const baseOutPath = "stories";
const createSlide = ({ bootcamp }) => ({
  id: "bootcamp:thanks",
  type: "threeLine",
  params: {
    backgroundColor: "#000000",
    backgroundImage: "/img/bootcamp2.jpg",
    backgroundOpacity: 0.2,
    topSubtitle: "HMIF Bootcamp",
    mainText: `Terima kasih udah ikut bootcamp <span class='text-yellow'>${bootcamp}</span>!`,
    bodyText: `Terima kasih ya udah jadi peserta bootcamp <b>${bootcamp}</b>. Semoga ilmu yang kamu dapatkan bisa berguna untuk kedepannya ya! Jangan lupa juga sharing ilmunya ke orang lain biar kita semua bisa jago bareng-bareng :)`,
  },
});

async function generate() {
  const entries = await readEntries();

  entries.forEach((d) => {
    const { name, course } = d;
    const results = fuseDim.search(name);
    if (results.length === 0) {
      console.log("Cannot resolve", name);
      return;
    }

    const { item, score } = results[0];
    if (score > 0.1) {
      console.log("Cannot resolve", name, score);
      return;
    }

    console.log("Resolved", name, "to", item.nim, item.name);

    const storyOutDir = path.join(baseOutPath, item.nim);
    console.log("Writing slide for", item.nim, name);

    if (!fs.existsSync(storyOutDir)) fs.mkdirSync(storyOutDir);
    fs.writeFileSync(
      path.join(storyOutDir, "28_bootcamp_thanks.json"),
      JSON.stringify([createSlide({ bootcamp: course })])
    );
  });
}

generate();
