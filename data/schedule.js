const db = require("./admin");
const venues = require("./venues.json");
const schedule = require("./schedule.json");

async function bulkAdd() {
  const collectionName = "schedule";

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

  schedule.forEach(({ venue, ...event }) => {
    const docRef = db.collection(collectionName).doc();
    batch.set(docRef, {
      ...event,
      address: venues[venue].address,
      location: venues[venue].name,
      maps: venue,
    });
  });

  await batch.commit();
  console.log("Batch write completed.");
}

bulkAdd();
