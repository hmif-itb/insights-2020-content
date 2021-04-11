const fs = require("fs");
const path = require("path");

const baseOutPath = "stories";
const slide = {
  id: "hmif_goes_out",
  type: "threeLine",
  params: {
    backgroundColor: "#1F005D",
    topSubtitle: "HMIF Goes Out",
    mainText:
      "Kita sudah mengunjungi <span class='text-yellow'>4 perusahaan</span> secara online",
    bodyText:
      "Di kepengurusan ini, HMIF sudah mengunjungi 4 perusahaan secara daring dengan <b>400+ peserta</b>.<br /><br />Perusahaan yang kita kunjungi:",
    listItems: ["GDP Labs", "Doku", "Accenture Indonesia", "Stockbit"],
    backgroundImage: "/img/goesout.jpg",
    backgroundOpacity: 0.15,
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
      path.join(storyOutDir, "24_hmif_goes_out.json"),
      JSON.stringify([slide])
    );
  });
}

generate();
