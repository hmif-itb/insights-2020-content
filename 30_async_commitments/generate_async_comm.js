const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const results = [];

const readCommitments = () =>
  new Promise((resolve, reject) => {
    fs.createReadStream("30_async_commitments/komitmen_async.csv")
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(results);
      });
  });

const readDim = () => {
  return JSON.parse(fs.readFileSync("dim.json"));
};

const buildSlide = (commitment) => {
  const titleText = `Waktu SPARTA 11 kami pernah bertanya apa <span class='text-yellow'>komitmen kamu</span>.`;
  const bodyText = `Kamu menjawab:<br /><b>${commitment}</b>`;

  return {
    id: "async_commitments",
    type: "threeLine",
    params: {
      topSubtitle: "#KomitmenKamu",
      mainText: titleText,
      bodyText,
    },
  };
};

const baseOutPath = "stories";

async function generate() {
  const commitments = await readCommitments();
  const dim = readDim();

  const joined = commitments
    .map((c) => {
      const mhs = dim.find((d) => d.nimTpb === c.nimTpb);
      return mhs ? { ...mhs, commitment: c.komitmen } : undefined;
    })
    .filter((a) => !!a)
    .filter((a) => !!a.commitment);

  joined.forEach((d) => {
    const { nim, name, commitment } = d;
    const slide = buildSlide(commitment);
    const storyOutDir = path.join(baseOutPath, nim);

    console.log("Writing slide for", nim, name);

    if (!fs.existsSync(storyOutDir)) fs.mkdirSync(storyOutDir);
    fs.writeFileSync(
      path.join(storyOutDir, "30_async_commitments.json"),
      JSON.stringify([slide])
    );
  });
}

generate();
