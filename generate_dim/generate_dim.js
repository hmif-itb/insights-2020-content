const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const results = [];

const readNicknames = () =>
  new Promise((resolve, reject) => {
    fs.createReadStream("generate_dim/DIM-Nickname.csv")
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(results);
      });
  });

const readDim = () => {
  const dim = JSON.parse(fs.readFileSync("generate_dim/mhs.json"));
  return dim.map((d) => ({ nim: d.NIM_Jurusan, nimTpb: d.NIM_TPB, name: d.Nama }));
};

async function generate() {
  const nicknames = await readNicknames();
  const dim = readDim();

  const joined = dim.map((d) => {
    const nickname = nicknames.find((n) => n.nim === d.nim);
    return { ...d, nickname: nickname ? nickname.nickname : undefined };
  });

  fs.writeFileSync("dim.json", JSON.stringify(joined));
}

generate();
