const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const results = [];

const readEntries = () =>
  new Promise((resolve, reject) => {
    fs.createReadStream("60_kangenkamu/data.csv")
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(results);
      });
  });

const readDim = () => {
  return JSON.parse(fs.readFileSync("dim.json"));
};

const dim = readDim();

const buildIntroSlide = () => {
  return {
    id: "kangenkamu_intro",
    type: "threeLine",
    params: {
      topSubtitle: "#KangenKamu",
      mainText:
        "Waktu itu, kami meminta kalian menuliskan kesan &amp; pesan untuk teman-teman melalui #KangenKamu.",
      bodyText: "Sekarang, lihat apa yang teman-teman kamu tulis buatmu.",
      backgroundColor: "#580014",
      backgroundOpacity: 0.2,
      backgroundImage: "/img/kangen-kamu.jpg",
    },
  };
};

const buildSlide = (
  fromId,
  fromReadable,
  recipientsNicknames,
  backgroundImage,
  quote
) => {
  const nicknamesComposed = recipientsNicknames
    .map((n, i) => (i == recipientsNicknames.length - 1 ? `dan ${n}` : n))
    .join(", ");
  const person =
    recipientsNicknames.length === 1
      ? `${fromReadable}`
      : `${fromReadable}<br /><small style='opacity: 0.5'>Untuk ${nicknamesComposed}</small>`;

  return {
    id: `kangenkamu_remarks:${fromId}`,
    type: "personQuotes",
    params: {
      quote,
      person,
      backgroundImage,
      backgroundColor: "#580014",
      backgroundOpacity: 0.15,
    },
  };
};

const resolveFromStr = (fromStr) => {
  if (fromStr.startsWith("nim:")) {
    const nim = fromStr.split(":")[1];
    const mhs = dim.find((d) => d.nim === nim);
    const name = mhs.name;
    const year = parseInt(nim.substring(3, 5));
    const angkatan = (() => {
      if (year === 16) return "BIT 2016";
      else if (year === 17) return "UNIX 2017";
      else if (year === 18) return "Decrypt 2018";
      else if (year === 19) return "Async 2019";
    })();

    const backgroundImage = `https://storage.googleapis.com/hmif-insights/portraits/${year}/${nim}.jpg`;

    return { id: nim, readable: name + ", " + angkatan, backgroundImage };
  } else {
    return { id: fromStr, readable: fromStr, backgroundImage: "" };
  }
};

const resolveNickname = (nim) => dim.find((d) => d.nim === nim)?.nickname;

const baseOutPath = "stories";

async function generate() {
  const entries = await readEntries();

  const joined = entries.map((e) => {
    const from = e.From;
    const to = e.To.split(",");
    const { id, readable, backgroundImage } = resolveFromStr(from);
    const nicknames = e.To.split(",").map((nim) => resolveNickname(nim));
    const message = e.Message.replace(/\n/g, "<br />");

    return {
      recipients: to,
      fromId: id,
      fromReadable: readable,
      backgroundImage,
      recipientNicknames: nicknames,
      message,
    };
  });

  const splitIntoRecipients = joined.reduce((acc, curr) => {
    const repeated = curr.recipients.map((t) => ({
      ...curr,
      recipients: undefined,
      recipient: t,
    }));
    return [...acc, ...repeated];
  }, []);

  const slides = splitIntoRecipients.reduce((acc, curr) => {
    const recipient = curr.recipient;
    if (acc[recipient] === undefined) {
      acc[recipient] = [buildIntroSlide()];
    }

    const {
      fromId,
      fromReadable,
      backgroundImage,
      recipientNicknames,
      message,
    } = curr;

    const slide = buildSlide(
      fromId,
      fromReadable,
      recipientNicknames,
      backgroundImage,
      message
    );

    acc[recipient].push(slide);
    return acc;
  }, {});

  Object.keys(slides).forEach((nim) => {
    const slide = slides[nim];
    const storyOutDir = path.join(baseOutPath, nim);

    console.log("Writing slide for", nim);

    if (!fs.existsSync(storyOutDir)) fs.mkdirSync(storyOutDir);
    fs.writeFileSync(
      path.join(storyOutDir, "60_kangenkamu.json"),
      JSON.stringify(slide)
    );
  });
}

generate();
