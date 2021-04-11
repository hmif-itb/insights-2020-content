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

async function analyze() {
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

  const senderMessagesCount = joined
    .filter((x) => !isNaN(x.fromId))
    .reduce((acc, curr) => {
      const { fromId } = curr;
      if (!acc[fromId]) acc[fromId] = 1;
      else acc[fromId]++;
      return acc;
    }, {});

  const sortedSendersByMessageCount = Object.keys(
    senderMessagesCount
  ).map((key) => [key, senderMessagesCount[key]]);
  sortedSendersByMessageCount.sort((a, b) => b[1] - a[1]);

  console.log(
    "There are",
    sortedSendersByMessageCount.length,
    "distinct non-anonymous senders"
  );
  console.log("Top 10 non-anonymous senders:");
  sortedSendersByMessageCount.slice(0, 10).forEach(([nim, count], i) => {
    const name = dim.find((d) => d.nim === nim)?.name;
    console.log(i + 1 + ".", nim, name, count);
  });

  console.log();

  const splitIntoRecipients = joined.reduce((acc, curr) => {
    const repeated = curr.recipients.map((t) => ({
      ...curr,
      recipients: undefined,
      recipient: t,
    }));
    return [...acc, ...repeated];
  }, []);

  const recipientsMessageCount = splitIntoRecipients.reduce((acc, curr) => {
    const { recipient } = curr;
    if (!acc[recipient]) acc[recipient] = 1;
    else acc[recipient]++;
    return acc;
  }, {});

  const sortedRecipientsByMessageCount = Object.keys(
    recipientsMessageCount
  ).map((key) => [key, recipientsMessageCount[key]]);
  sortedRecipientsByMessageCount.sort((a, b) => b[1] - a[1]);

  console.log(
    "There are",
    sortedRecipientsByMessageCount.length,
    "distinct recipients"
  );
  console.log("Top 10 recipients:");
  
  sortedRecipientsByMessageCount.slice(0, 10).forEach(([nim, count], i) => {
    const name = dim.find((d) => d.nim === nim)?.name;
    console.log(i + 1 + ".", nim, name, count);
  });
}

analyze();
