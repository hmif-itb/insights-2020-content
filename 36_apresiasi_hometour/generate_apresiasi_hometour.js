const fs = require("fs");
const path = require("path");

const baseOutPath = "stories";

const readDim = () => {
  return JSON.parse(fs.readFileSync("dim.json"));
};

const nonhim = [
  "13518134",
  "13518139",
  "18218047",
  "13519096",
  "13517078",
  "13518076",
  "13519125",
].map((nim) => ({
  nim,
  title:
    "Begadang jangan begadang, kalau tiada artinya... Begadang boleh saja... Asal nubes atau nonhim...",
  body:
    "Terima kasih atas partisipasi kamu buat ikut nonhim, terlebih lagi, kamu sukses menangin mini games dan dapetin chatime dari kita. Hehehe, rasa yang gratisan biasanya lebih enak, bukan?",
  backgroundColor: "#0E2B87",
}));

const dota = [
  "13518097",
  "13519217",
  "13518033",
  "18219007",
  "18219085",
  "13518146",
  "13519007",
  "13517044",
  "18219091",
  "13519211",
].map((nim) => ({
  nim,
  title: "Hometur dulu, The International kemudian",
  body:
    "Selamat atas kemenangan kamu dalam Home Tournament Dota! Lanjutkan bakatmu ya gan! ditunggu debutnya di The International.",
  backgroundColor: "#0E2B87",
}));

const catur = ["13519158", "13518079", "13518012"].map((nim) => ({
  nim,
  title:
    "Dewa Kipas? Gotham Chess? Irene Sukandar? Santai, kelak mereka bakal kamu lampaui",
  body:
    "Selamat atas kemenangan kamu dalam Home Tournament Catur!<br /><br />Semoga selanjutnya kamu bisa jadi GrandMaster dari Indonesia. Sekarang mah kecil-kecilan aja dulu ya kan?",
  backgroundColor: "#0E2B87",
}));

const mobileLegend = [
  "18219078",
  "13519107",
  "13518032",
  "13519065",
  "18218020",
  "18218048",
  "18219026",
  "13519219",
  "18219003",
  "18218018",
].map((nim) => ({
  nim,
  title:
    "Killing Spree! Megakill! Unstopable! Monster Kill! Godlike! Legendary!",
  body:
    "Hahaha, pasti hal tersebut gak asing buat kamu yang sering main Mobile Legend dan jagoan banget ngekill musuh! Anyway, selamat atas kemenangan kamu dalam Home Tournament Mobile Legend",
  backgroundColor: "#0E2B87",
}));

const recipients = [...nonhim, ...dota, ...catur, ...mobileLegend];

const createSlide = ({
  nickname,
  title,
  body,
  backgroundImage,
  backgroundColor,
  backgroundOpacity,
}) => ({
  id: "apresiasi_hometour",
  type: "threeLine",
  params: {
    bottom: true,
    topSubtitle: `Hometour`,
    mainText: title,
    bodyText: body,
    backgroundImage,
    backgroundColor,
    backgroundOpacity,
  },
});

async function generate() {
  const dim = readDim();

  recipients.forEach(
    ({
      nim,
      title,
      body,
      backgroundImage,
      backgroundColor,
      backgroundOpacity,
    }) => {
      const { name, nickname } = dim.find((x) => x.nim === nim);
      const storyOutDir = path.join(baseOutPath, nim);

      console.log("Writing slide for", nim, name);

      if (!fs.existsSync(storyOutDir)) fs.mkdirSync(storyOutDir);
      fs.writeFileSync(
        path.join(storyOutDir, "36_apresiasi_hometour.json"),
        JSON.stringify([
          createSlide({
            nickname,
            title,
            body,
            backgroundImage,
            backgroundColor,
            backgroundOpacity,
          }),
        ])
      );
    }
  );
}

generate();
