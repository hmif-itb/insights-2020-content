const fs = require("fs");
const path = require("path");

const baseOutPath = "stories";
const slide = {
  id: "gemastik",
  type: "threeLine",
  params: {
    backgroundColor: "#750000",
    topSubtitle: "GEMASTIK XIII",
    mainText:
      "Kontingen ITB mendapat <span class='text-yellow'>peringkat 3</span> di GEMASTIK 13!",
    bodyText:
      "HMIF bersama dengan Pusat AI ITB dan Ditmawa mengadakan persiapan Pra-Gemastik yang diikuti oleh <b>110 pendaftar</b> dan berhasil mencetak <b>15 finalis</b> dan <b>6 juara</b>!<br /><br />Kontingen ITB pun berhasil meraih peringkat 3, naik dari tahun sebelumnya peringkat 4.",
    backgroundImage: "/img/gemastik.jpg",
    backgroundOpacity: 0.25,
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
      path.join(storyOutDir, "26_gemastik.json"),
      JSON.stringify([slide])
    );
  });
}

generate();
