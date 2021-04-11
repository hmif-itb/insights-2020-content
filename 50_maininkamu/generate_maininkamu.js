const fs = require("fs");
const path = require("path");

const readMaininKamu = () => {
  const raw = JSON.parse(fs.readFileSync("50_maininkamu/maininkamu.json"));
  return Object.keys(raw).map((k) => ({ nim: k, ...raw[k] }));
};

const buildSlide = (title, subtitle) => {
  return {
    id: "maininkamu",
    type: "threeLine",
    params: {
      topSubtitle: "#MaininKamu",
      mainText: title,
      bodyText: subtitle,
      backgroundColor: "#C70054",
    },
  };
};

const baseOutPath = "stories";

async function generate() {
  const data = readMaininKamu();

  data.forEach((d) => {
    const { nim, title, subtitle } = d;
    const slide = buildSlide(title, subtitle);
    const storyOutDir = path.join(baseOutPath, nim);

    console.log("Writing slide for", nim);

    if (!fs.existsSync(storyOutDir)) fs.mkdirSync(storyOutDir);
    fs.writeFileSync(
      path.join(storyOutDir, "50_maininkamu.json"),
      JSON.stringify([slide])
    );
  });
}

generate();
