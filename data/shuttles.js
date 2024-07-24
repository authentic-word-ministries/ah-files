const db = require("./admin");
const venues = require("./venues.json");

const to = "FLXHqYT1RgbmhsC4A";

const shuttles = [
  {
    time: ["2024-08-04T14:00"],
    from: ["1oHHw9nzzuif2X1m9"],
  },
  {
    time: [
      "2024-08-05T14:00",
      "2024-08-06T14:00",
      "2024-08-07T14:00",
      "2024-08-08T14:00",
      "2024-08-09T14:00",
      "2024-08-10T14:00",
      "2024-08-11T14:00",
    ],
    from: [
      "1oHHw9nzzuif2X1m9",
      "e3g5JxqL5g1vgSYp7",
      "T4bXV1H3NKBimtFr7",
      "CjX3nvgYrFjxLVrR6",
      "h3nsSycnHp28pXs4A",
    ],
  },
];

async function bulkAdd() {
  const collectionName = "shuttles";

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

  shuttles.forEach((shuttle) => {
    shuttle.time.forEach((time) => {
      shuttle.from.forEach((from) => {
        const docRef = db.collection(collectionName).doc();

        const data = {
          date: time,
          from_address: venues[from].address,
          from_maps: from,
          from_name: venues[from].name,
          to_address: venues[to].address,
          to_name: venues[to].name,
        };
        batch.set(docRef, data);
      });
    });
  });

  await batch.commit();
  console.log("Batch write completed.");
}

bulkAdd();
