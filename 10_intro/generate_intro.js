const fs = require("fs");
const path = require("path");

const baseOutPath = "stories";

const entryYear = {
  16: "2017",
  17: "2018",
  18: "2019",
  19: "2020",
};

const body = {
  16: "Setelah tiga bulan menghadapi teriakan Asep dan Jundi, akhirnya kamu dilantik menjadi angkatan BIT 2016.",
  17: "Setelah tiga bulan menghadapi teriakan Tio dan Ambar, akhirnya kamu dilantik menjadi angkatan UNIX 2017.",
  18: "Setelah tiga bulan menghadapi sarkasme Agwar dan teriakan Ucup, akhirnya kamu dilantik menjadi angkatan Decrypt 2018.",
  19: "Setelah dua bulan menghadapi cek AFK yang sering kelewat, koneksi internet gak stabil, kuota abis, dan amarah Mutek, Fadhil & Aqil, akhirnya kamu dilantik menjadi angkatan Async 2019.",
};

const bg = {
  16: "/img/bit.jpg",
  17: "/img/unix.jpg",
  18: "/img/decrypt.jpg",
  19: "/img/async.jpg",
};

const buildSlide = (nim, name, nickname) => {
  const year = nim.substring(3, 5);
  const bodyText = body[year];
  const titleText = `Kamu bergabung dengan HMIF pada tahun <span class='text-yellow'>${entryYear[year]}</span>.`;
  const backgroundImage = bg[year];

  return {
    id: "intro",
    type: "threeLine",
    params: {
      topSubtitle: `Hi, ${nickname !== "" ? nickname : name}!`,
      mainText: titleText,
      bodyText,
      backgroundImage,
      backgroundOpacity: 0.15,
    },
  };
};

const readDim = () => {
  return JSON.parse(fs.readFileSync("dim.json"));
};

async function generate() {
  const dim = readDim();

  dim.forEach((d) => {
    const { nim, name, nickname } = d;
    const slide = buildSlide(nim, name, nickname);
    const storyOutDir = path.join(baseOutPath, nim);

    console.log("Writing slide for", nim, name);

    if (!fs.existsSync(storyOutDir)) fs.mkdirSync(storyOutDir);
    fs.writeFileSync(
      path.join(storyOutDir, "10_intro.json"),
      JSON.stringify([slide])
    );
  });
}

generate();
