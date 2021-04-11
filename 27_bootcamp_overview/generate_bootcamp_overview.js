const fs = require("fs");
const path = require("path");

const baseOutPath = "stories";
const slide = {
  id: "bootcamp",
  type: "threeLine",
  params: {
    backgroundColor: "#000000",
    topSubtitle: "HMIF Bootcamp",
    mainText:
      "<span class='text-yellow'>306 orang</span> mendaftar untuk ikut HMIF Bootcamp!",
    bodyText:
      "Tahun ini, walaupun Bootcamp hanya dilakukan satu kali, tetapi antusiasme warga ITB ternyata tinggi. 306 orang tersebut berasal dari <b>41 prodi dan fakultas</b> yang berbeda, bahkan termasuk Mikrobiologi, Teknik Perminyakan, dan Desain Produk. Dari 306 pendaftar, dipilih 78 peserta.",
    backgroundImage: "/img/bootcamp.jpg",
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
