const fs = require("fs");
const path = require("path");

const baseOutPath = "stories";
const slide = {
  id: "codemy",
  type: "threeLine",
  params: {
    topSubtitle: "Codemy",
    mainText:
      "HMIF berhasil menjual <span class='text-yellow'>1200+ eksemplar</span> Codemy lho!",
    bodyText:
      "Codemy, buku tutorial Pengenalan Komputasional untuk warga TPB, berhasil terjual <b>1200+ eksemplar</b> ke berbagai kalangan di ITB, dan bahkan kampus lain, lho.<br /><br />Penjualan Codemy berhasil mendatangkan tambahan kas HMIF sebesar <b>Rp13 juta</b> :)",
    backgroundColor: "#005282",
    backgroundOpacity: 0.15,
    backgroundImage: "/img/codemy.jpg",
  },
};

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
      path.join(storyOutDir, "22_codemy.json"),
      JSON.stringify([slide])
    );
  });
}

generate();
