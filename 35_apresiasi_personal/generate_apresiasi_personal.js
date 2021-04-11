const fs = require("fs");
const path = require("path");

const baseOutPath = "stories";

const readDim = () => {
  return JSON.parse(fs.readFileSync("dim.json"));
};

const apresiasiBebersihSekre = [
  "13517076",
  "18218021",
  "13517046",
  "13517107",
  "13519020",
  "13519149",
  "18218038",
].map((nim) => ({
  nim,
  title: "Terima kasih udah mau bersihin sekre yang dicintai warga HMIF!",
  body:
    "Berkat kamu, sekre masih bisa terlihat bersih meskipun tidak bisa kita akses. Semoga kamu juga dapat refreshing bisa ngeliat-liat ITB lagi ya hehehe",
}));

const apresiasiKawis = [
  {
    nim: "13518145",
    title:
      "Karena kamu dan timmu, Wisuda April sudah jadi acara yang <span class='text-yellow'>keren</span>!",
    body:
      "Berkat kamu, banyak wisudawan yang mendapatkan kesan terbaik pada saat-saat terakhirnya di HMIF. Semoga pengalaman ini bisa bermanfaat buat kamu ke depannya!",
    backgroundColor: "#000000",
    backgroundOpacity: 0.15,
    backgroundImage: "/img/wisuda.jpg",
  },
  {
    nim: "13518046",
    title:
      "Karena kamu dan timmu, Wisuda Juli sudah jadi acara yang <span class='text-yellow'>keren</span>!",
    body:
      "Berkat kamu, banyak wisudawan yang mendapatkan kesan terbaik pada saat-saat terakhirnya di HMIF. Semoga pengalaman ini bisa bermanfaat buat kamu ke depannya!",
    backgroundColor: "#000000",
    backgroundOpacity: 0.15,
    backgroundImage: "/img/wisuda.jpg",
  },
  {
    nim: "18218011",
    title:
      "Karena kamu dan timmu, Wisuda Oktober sudah jadi acara yang <span class='text-yellow'>keren</span>!",
    body:
      "Berkat kamu, banyak wisudawan yang mendapatkan kesan terbaik pada saat-saat terakhirnya di HMIF. Semoga pengalaman ini bisa bermanfaat buat kamu ke depannya!",
    backgroundColor: "#000000",
    backgroundOpacity: 0.15,
    backgroundImage: "/img/wisuda.jpg",
  },
];

const apresiasiPenutor = [
  "13518017",
  "13518122",
  "13519124",
  "13519012",
  "13519160",
  "13519143",
  "18218040",
  "13517109",
  "13518123",
  "13518114",
  "13518005",
  "13518018",
  "13518119",
  "13518125",
  "18219054",
  "13519044",
  "13519124",
  "13519164",
  "18217025",
  "18218027",
  "18219082",
  "18219050",
].map((nim) => ({
  nim,
  title:
    "Nominal Gopay gak seberapa dibanding <span class='text-yellow'>impact</span> yang kamu berikan pada teman-teman kamu!",
  body:
    "Mewakili segenap orang yang pernah <strike>jadi pacar kamu</strike> kamu tutorin, aku mau bilang terima kasih ya atas jasa kamu!! Berkat kamu, UTS sama UAS jadi kerasa lebih siap... Jangan kapok ya buat ngajarin kita-kita hehehe",
}));

const recipients = [
  ...apresiasiBebersihSekre,
  ...apresiasiKawis,
  ...apresiasiPenutor,
];

const createSlide = ({
  nickname,
  title,
  body,
  backgroundImage,
  backgroundColor,
  backgroundOpacity,
}) => ({
  id: "apresiasi_personal",
  type: "threeLine",
  params: {
    bottom: true,
    topSubtitle: `Hi, ${nickname}!`,
    mainText: title,
    bodyText: body,
    backgroundColor: "#000000",
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
        path.join(storyOutDir, "35_apresiasi_personal.json"),
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
