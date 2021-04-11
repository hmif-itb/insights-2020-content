const fs = require("fs");
const path = require("path");

const baseOutPath = "stories";
const createSlide = ({ tricked }) => ({
  id: "phishing_test",
  type: "threeLine",
  params: {
    backgroundColor: "#000000",
    topSubtitle: "Phishing Test",
    mainText: "<span class='text-yellow'>109 orang</span> kena tipu dong!",
    bodyText:
      "Bulan September 2020 lalu, kami iseng mengirimkan email phishing ke warga Async, Decrypt, UNIX, dan sebagian BIT. <br /><br />" +
      `Hasilnya? <b>214 orang</b> membuka link phishing${
        tricked ? ", <b>termasuk kamu</b>," : ""
      } dan <b>109 orang</b> mensubmit username dan password! Tapi tenang aja, password dan username kalian gak kami simpen kok :)<br /><br />` +
      "Jangan lupa untuk selalu hati-hati kalo lagi online ya!",
    backgroundImage: "/img/hackerman.jpg",
    backgroundOpacity: 0.35,
  },
});

const readDim = () => {
  return JSON.parse(fs.readFileSync("dim.json"));
};

const readEvents = () => {
  const recipients = JSON.parse(
    fs.readFileSync("25_phishing_test/recipients.json").toString()
  );
  const file = fs.readFileSync("25_phishing_test/out_events.json").toString();
  const rows = file
    .split("\n")
    .filter((x) => !!x)
    .map((line) => JSON.parse(line));

  const linkOpenedEvents = rows
    .filter((r) => r.type === "loginPageLoaded")
    .filter((r) => !r.targetId.startsWith("ack-"))
    .map((r) => recipients.find((e) => e.tag === r.targetId)?.nim)
    .filter((x) => !!x)
    .filter(function (item, pos, self) {
      return self.indexOf(item) == pos;
    });

  return linkOpenedEvents;
};

async function generate() {
  const dim = readDim();
  const events = readEvents();

  dim.forEach((d) => {
    const { nim, name, nickname } = d;
    const storyOutDir = path.join(baseOutPath, nim);

    // console.log("Writing slide for", nim, name);

    if (!fs.existsSync(storyOutDir)) fs.mkdirSync(storyOutDir);
    fs.writeFileSync(
      path.join(storyOutDir, "25_phishing_test.json"),
      JSON.stringify([createSlide({ tricked: events.includes(nim) })])
    );
  });
}

generate();
