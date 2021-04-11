const fs = require("fs");
const path = require("path");

const baseOutPath = "stories";
const slide = {
  "id": "covid19",
  "type": "covid19"
}

const readDim = () => {
  return JSON.parse(fs.readFileSync("dim.json"));
};

async function generate() {
  const dim = readDim();

  dim.forEach((d) => {
    const { nim, name, nickname } = d;
    const storyOutDir = path.join(baseOutPath, nim);

    console.log("Writing slide for", nim, name);

    if (!fs.existsSync(storyOutDir)) fs.mkdirSync(storyOutDir);
    fs.writeFileSync(
      path.join(storyOutDir, "20_covid19.json"),
      JSON.stringify([slide])
    );
  });
}

generate();
