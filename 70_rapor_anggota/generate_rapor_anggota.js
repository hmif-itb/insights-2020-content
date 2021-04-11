const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const Fuse = require("fuse.js");

const results = [];

const readEntries = () =>
  new Promise((resolve, reject) => {
    fs.createReadStream("70_rapor_anggota/data_lpjat.csv")
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
const fuseDim = new Fuse(dim, {
  includeScore: true,
  keys: ["name"],
});

const buildSummarySlide = (slideParam) => {
  const { roles } = slideParam;
  return {
    id: "rapor_anggota:teams",
    type: "threeLine",
    params: {
      backgroundColor: "#008C98",
      mainText: `Di kepengurusan ini, kamu sudah terlibat dalam <span class='text-yellow'>${roles.length} organisasi atau kepanitiaan</span>.`,
      bodyText: "Selama di HMIF, kamu terlibat sebagai:",
      listItems: roles,
      backgroundImage: "/img/orgpart.jpg",
      backgroundOpacity: 0.15,
    },
  };
};

const scoreIntroSlide = {
  id: "rapor_anggota:scores_head",
  type: "centeredTitleText",
  params: {
    mainText: "Berikut adalah Rapor Anggota akhir tahunmu",
    backgroundColor: "#008C98",
  },
};

const buildScoreSlide = (slideParam) => {
  const { org, role, supervisors, scores, url, remarks } = slideParam;

  return {
    id: "rapor_anggota:scores:" + supervisors.map((s) => s.nim).join(","),
    type: "raporAnggota",
    params: {
      backgroundColor: "#008C98",
      org,
      role,
      supervisor: supervisors.map((s) => s.name).join(", "),
      scores,
      url,
      remarks,
    },
  };
};

const buildRemarksSlide = (slideParam) => {
  const { supervisors, url, remarks } = slideParam;
  const backgroundImage = (() => {
    if (supervisors.length === 1) {
      const supervisorNim = supervisors[0]?.nim;
      const year = supervisorNim?.substring(3, 5);
      return `https://storage.googleapis.com/hmif-insights/portraits/${year}/${supervisorNim}.jpg`;
    }

    return "";
  })();

  const person = supervisors
    .map((s) => `${s.name}<br /><small style='opacity: 0.5'>${s.role}</small>`)
    .join("<br /><br />");

  return {
    id: "rapor_anggota:remarks:" + supervisors.map((s) => s.nim).join(","),
    type: "personQuotes",
    params: {
      quote: remarks,
      person,
      backgroundColor: "#008C98",
      backgroundImage,
      backgroundOpacity: 0.15,
    },
  };
};

const parseScores = (entry) => {
  const paramsSuffixes = [1, 2, 3, 4, 5];
  const scores = [];

  paramsSuffixes.forEach((suff) => {
    if (entry["Nama_Parameter_" + suff]) {
      scores.push({
        criteria: entry["Nama_Parameter_" + suff],
        score: entry["Persentase_" + suff],
      });
    }
  });

  return scores;
};

const baseOutPath = "stories";

async function generate() {
  const entries = await readEntries();

  const summaries = entries.reduce((acc, curr) => {
    const nim = curr.NIM;
    const org = curr.Kegiatan;
    const role = curr.Jabatan;

    if (!acc[nim]) {
      acc[nim] = [];
    }

    const text = [role, org].filter((a) => !!a).join(", ");
    acc[nim].push(text);

    return acc;
  }, {});

  const hardcodedSupervisorRole = {
    18217018: "Ketua HMIF 2020/2021",
    13517015: "Ketua Pelaksana Arkavidia 7.0",
    18217034: "Koordinator DPP",
    13518076: "Ketua Pelaksana Codemy 2.0",
  };

  const supervisorNameMapping = {};
  const entriesWithSupervisorNim = entries.map((e) => {
    const supervisor = e.Supervisor.replace("\r\n", " dan ")
      .replace(", ", " dan ")
      .replace(" & ", " dan ")
      .split(" dan ");
    const supervisors = supervisor.map((name) => {
      if (supervisorNameMapping[name]) {
        return supervisorNameMapping[name];
      }

      const results = fuseDim.search(name);
      if (results.length === 0) {
        supervisorNameMapping[name] = { nim: null, name, role: null };
        return supervisorNameMapping[name];
      }

      const { item, score } = results[0];
      if (score > 0.1) {
        supervisorNameMapping[name] = { nim: null, name, role: null };
        return supervisorNameMapping[name];
      }

      let supervisorRole = "";
      if (hardcodedSupervisorRole[item.nim]) {
        supervisorRole = hardcodedSupervisorRole[item.nim];
      } else {
        const supervisorEntry = entries.find((e) => e.NIM === item.nim);
        supervisorRole = [supervisorEntry.Jabatan, supervisorEntry.Kegiatan]
          .filter((x) => !!x)
          .join(", ");
      }
      supervisorNameMapping[name] = {
        nim: item.nim,
        name: item.name,
        role: supervisorRole,
      };
      return supervisorNameMapping[name];
    });

    return { ...e, supervisors };
  });

  const slides = entriesWithSupervisorNim.reduce((acc, curr) => {
    const nim = curr.NIM;
    const scores = parseScores(curr);
    const url = undefined; // TODO
    const supervisors = curr.supervisors;

    if (!acc[nim]) {
      acc[nim] = [
        buildSummarySlide({ roles: summaries[nim] }),
        scoreIntroSlide,
      ];
    }

    const scoreSlide = buildScoreSlide({
      org: curr.Kegiatan,
      role: curr.Jabatan,
      supervisors,
      scores,
      url,
    });

    acc[nim].push(scoreSlide);

    const remarks = curr["Penilaian Sikap"];
    if (remarks.length > 3) {
      const remarksSlide = buildRemarksSlide({
        remarks,
        supervisors,
        url,
      });
      acc[nim].push(remarksSlide);
    }

    return acc;
  }, {});

  Object.keys(slides).forEach((nim) => {
    const slide = slides[nim];
    const storyOutDir = path.join(baseOutPath, nim);

    console.log("Writing slide for", nim);

    if (!fs.existsSync(storyOutDir)) fs.mkdirSync(storyOutDir);
    fs.writeFileSync(
      path.join(storyOutDir, "70_rapor_anggota.json"),
      JSON.stringify(slide)
    );
  });
}

generate();
