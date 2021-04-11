const fs = require("fs");
const path = require("path");

const baseOutPath = "stories";
const slide = {
  id: "iit_projects",
  type: "threeLine",
  params: {
    topSubtitle: "Inkubator IT",
    mainText:
      "Ada <span class='text-yellow'>140+ proyek</span> yang masuk Inkubator IT lho!",
    bodyText:
      "Di kepengurusan ini, IIT menerima 140+ proyek dari himpunan lain, perusahaan, dan bahkan mahasiswa lain. Teknologi yang digunakan juga bermacam-macam, ada dari web development, Unity, AR/VR, dan masih banyak lagi!<br /><br />Proyek dengan budget paling besar yang masuk ke IIT bernilai <b class='text-yellow'>Rp78 juta!</b>",
    backgroundColor: "#502E00",
    backgroundOpacity: 0.15,
    backgroundImage: "/img/money.jpg",
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
      path.join(storyOutDir, "21_iit.json"),
      JSON.stringify([slide])
    );
  });
}

generate();
