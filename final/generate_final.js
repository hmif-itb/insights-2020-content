require('dotenv').config();
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const finalDirectories = "./stories";
const slidesOutputDir = "./outslides";
const secret = process.env.GEN_SECRET || "hmif-itb";

if (!fs.existsSync(slidesOutputDir)) {
    fs.mkdirSync(slidesOutputDir);
}

const targets = fs.readdirSync(finalDirectories);
targets.forEach((nim) => {
  console.log("Generating stories for", nim);
  const mac = crypto.createHmac("sha1", secret).update(nim).digest("hex");
  const dir = path.join(finalDirectories, nim);
  const storiesFiles = fs.readdirSync(dir).sort();
  const stories = storiesFiles
    .map((filename) => {
      const filedir = path.join(dir, filename);
      return JSON.parse(fs.readFileSync(filedir));
    })
    .reduce((acc, curr) => [...acc, ...curr], []);

    const outDir = path.join(slidesOutputDir, mac + "-" + nim + ".json");
    fs.writeFileSync(outDir, JSON.stringify(stories));
    console.log(outDir);
});