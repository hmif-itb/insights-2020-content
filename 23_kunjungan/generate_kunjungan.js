const fs = require("fs");
const path = require("path");

const baseOutPath = "stories";
const slide = {
  id: "kunjungan",
  type: "threeLine",
  params: {
    backgroundColor: "#115300",
    topSubtitle: "Kunjungan",
    mainText:
      "HMIF sudah melakukan <span class='text-yellow'>8 kunjungan</span> dari universitas lain",
    bodyText: "Organisasi kampus lain yang pernah kunjungan dengan HMIF:",
    listItems: [
      "BEM Fasilkom Universitas Indonesia",
      "Himakom Universitas Gadjah Mada",
      "HIMTI Universitas Bina Nusantara",
      "HMIF Universitas Diponegoro",
      "HMIF Filkom Universitas Brawijaya",
      "HMTI Politeknik Negeri Malang",
      "HIMIT Politeknik Elektronika Negeri Surabaya",
      "HMTC Institut Teknologi Sepuluh Nopember",
    ],
    backgroundImage: "/img/kunjungan.jpg",
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
      path.join(storyOutDir, "23_kunjungan.json"),
      JSON.stringify([slide])
    );
  });
}

generate();
