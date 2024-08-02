const db = require("./admin");
const fs = require("fs").promises;
const path = require("path");
const { HTMLToJSON } = require("html-to-json-parser");

const t =
  "https://raw.githubusercontent.com/authentic-word-ministries/ah-files/main/data/bios/";

const directoryPath = path.join(__dirname, "bios");

async function bulkAdd() {
  const bios = [];

  const files = await fs.readdir(directoryPath);

  for (const file of files) {
    console.log(">>>", file);
    if (!file.endsWith(".html")) continue;

    const n = file.replace(".html", "");
    const img = n + '.jpg"';

    let data = await fs.readFile(path.join(directoryPath, file), "utf8");
    data = data
      .split("&nbsp;")
      .join(" ")
      .split("&amp;")
      .join("&")
      .split("\n")
      .join(" ")
      .split(" ")
      .filter((e) => e.length > 0)
      .join(" ");
    const [a, ...b] = data.split('src="');
    const [c, ...d] = b.join('src="').split('"');
    data = a + 'src="' + t + img + d.join('"');

    const json = await HTMLToJSON(`<html><body>${data}</body></html>`);
    const content = json.content[0].content.filter(
      (e) => typeof e !== "string"
    );
    const name = content[1].content.filter((e) => e !== "\n")[0];
    const title = content[2].content
      .filter((e) => typeof e !== "string")[0]
      .content.filter((e) => e !== "\n")[0];

    bios.push({
      bio: data,
      img,
      main: name.toLowerCase().includes("gitwaza") ? 0 : 1,
      name,
      title,
    });
  }

  const collectionName = "speakers";

  console.log("Start bulk write to collection: " + collectionName);

  await db
    .collection(collectionName)
    .get()
    .then(async (snapshot) => {
      if (snapshot.size > 0) {
        console.log("Removing existing documents...");
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      } else {
        console.log("No existing documents found.");
      }
    });

  const batch = db.batch();

  console.log("Adding new documents...");

  bios.forEach((bio) => {
    const docRef = db.collection(collectionName).doc();
    batch.set(docRef, bio);
  });

  await batch.commit();
  console.log("Batch write completed.");
}

bulkAdd();
