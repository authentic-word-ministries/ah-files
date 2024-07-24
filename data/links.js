const db = require("./admin");
const venues = require("./venues.json");

const url = "https://www.youtube.com/watch?v=tuKu3cxReHY";

const schedule = [
  { time: [null], at: null, description: null },
  {
    time: [
      "2024-08-04T16:00",
      "2024-08-05T16:00",
      "2024-08-06T16:00",
      "2024-08-07T16:00",
      "2024-08-08T16:00",
      "2024-08-09T16:00",
      "2024-08-10T16:00",
      "2024-08-11T16:00",
    ],
    at: "FLXHqYT1RgbmhsC4A",
    description: "Revival Conference",
  },
  {
    time: [
      "2024-08-04T08:00",
      "2024-08-04T11:00",
      "2024-08-11T08:00",
      "2024-08-11T11:00",
    ],
    at: "1oHHw9nzzuif2X1m9",
    description: "Church Service",
  },
  {
    time: ["2024-08-05T08:00", "2024-08-06T08:00", "2024-08-07T08:00"],
    at: "1oHHw9nzzuif2X1m9",
    description: "Mountain of Religion",
  },
  {
    time: ["2024-08-05T08:00", "2024-08-06T08:00", "2024-08-07T08:00"],
    at: "e3g5JxqL5g1vgSYp7",
    description: "Mountain of Family",
  },
  {
    time: ["2024-08-05T08:00", "2024-08-06T08:00", "2024-08-07T08:00"],
    at: "T4bXV1H3NKBimtFr7",
    description: "Mountain of Education",
  },
  {
    time: ["2024-08-05T08:00", "2024-08-06T08:00", "2024-08-07T08:00"],
    at: "CjX3nvgYrFjxLVrR6",
    description: "Mountain of Business",
  },
  {
    time: ["2024-08-05T08:00", "2024-08-06T08:00", "2024-08-07T08:00"],
    at: "h3nsSycnHp28pXs4A",
    description: "Intercession",
  },
  {
    time: ["2024-08-08T08:00"],
    at: "1oHHw9nzzuif2X1m9",
    description: "Mountain of Media",
  },
  {
    time: ["2024-08-09T08:00"],
    at: "1oHHw9nzzuif2X1m9",
    description: "Mountain of Arts & Entertainment",
  },
  {
    time: ["2024-08-10T08:00"],
    at: "1oHHw9nzzuif2X1m9",
    description: "Youth Arise",
  },
  {
    time: ["2024-08-10T08:00"],
    at: "1oHHw9nzzuif2X1m9",
    description: "Men Arise",
  },
  {
    time: ["2024-08-10T08:00"],
    at: "1oHHw9nzzuif2X1m9",
    description: "Women Arise",
  },
];

async function bulkAdd() {
  const collectionName = "live-links";

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

  schedule.forEach((sch) => {
    sch.time.forEach((time) => {
      const docRef = db.collection(collectionName).doc();

      const data =
        time === null
          ? {
              description: "Get to know Africa Haguruka",
              icon: "info",
              label: "About AH",
              order: 1,
              url: "https://afrikahaguruka.org/who-we-are",
            }
          : {
              description: sch.description,
              icon: "youtube",
              label: `Live at ${venues[sch.at].name}`,
              order: 2,
              start_time: new Date(time),
              url: url,
            };
      batch.set(docRef, data);
    });
  });

  await batch.commit();
  console.log("Batch write completed.");
}

bulkAdd();
