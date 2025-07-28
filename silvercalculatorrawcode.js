const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const POINTS_PER_ROTI = 10;
const ROTI_PER_ANA = 6;
const ANA_PER_VORI = 16;
const POINTS_PER_ANA = ROTI_PER_ANA * POINTS_PER_ROTI; // 60
const POINTS_PER_VORI = ANA_PER_VORI * POINTS_PER_ANA; // 960

function toPoints(v, a, r, p) {
  return v * POINTS_PER_VORI + a * POINTS_PER_ANA + r * POINTS_PER_ROTI + p;
}

function fromPoints(points) {
  const v = Math.floor(points / POINTS_PER_VORI);
  points %= POINTS_PER_VORI;
  const a = Math.floor(points / POINTS_PER_ANA);
  points %= POINTS_PER_ANA;
  const r = Math.floor(points / POINTS_PER_ROTI);
  const p = points % POINTS_PER_ROTI;
  return { v, a, r, p };
}

function parseWeight(input) {
  const [v, a, r, p] = input.split(".").map(Number);
  if (a > 15 || r > 5 || p > 9) {
    throw new Error(
      `❌ Invalid input: ana ≤ 15, roti ≤ 5, point ≤ 9. You entered ${v}.${a}.${r}.${p}`
    );
  }
  return { v, a, r, p };
}

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

(async function main() {
  console.log("💠 Silver Weight Calculator");
  console.log("1️⃣  Subtract specific weight from total");
  console.log("2️⃣  Subtract (unit weight × total weight in vori) from total");

  const option = await ask("Choose option (1 or 2): ");

  try {
    let finalPoints = 0;

    if (option === "1") {
      const w1 = parseWeight(await ask("Enter total weight (vori.ana.roti.point): "));
      const w2 = parseWeight(await ask("Enter weight to subtract (vori.ana.roti.point): "));

      const w1Points = toPoints(w1.v, w1.a, w1.r, w1.p);
      const w2Points = toPoints(w2.v, w2.a, w2.r, w2.p);

      if (w2Points > w1Points) {
        console.log("❌ Subtracting weight cannot be more than total.");
        rl.close();
        return;
      }

      finalPoints = w1Points - w2Points;

      const remaining = fromPoints(finalPoints);
      console.log(`✅ Remaining weight: ${remaining.v}.${remaining.a}.${remaining.r}.${remaining.p}`);

      const pricePerVori = parseFloat(await ask("Enter silver price per vori: "));
      const totalPrice = (finalPoints / POINTS_PER_VORI) * pricePerVori;
      console.log(`💰 Final price: ${totalPrice.toFixed(2)}`);

    } else if (option === "2") {
      const weight1 = parseWeight(await ask("Enter full weight (vori.ana.roti.point): "));
      const subtractUnit = parseWeight(await ask("Enter subtract unit per vori (vori.ana.roti.point): "));

      const basePoints = toPoints(weight1.v, weight1.a, weight1.r, weight1.p);
      const unitPoints = toPoints(subtractUnit.v, subtractUnit.a, subtractUnit.r, subtractUnit.p);

      const weightInVori = basePoints / POINTS_PER_VORI;
      const multipliedPoints = unitPoints * weightInVori;

      if (multipliedPoints > basePoints) {
        console.log("❌ Cannot subtract more than total weight.");
        rl.close();
        return;
      }

      const remainingPoints = basePoints - multipliedPoints;
      const remaining = fromPoints(Math.round(remainingPoints));
      console.log(`✅ Remaining weight: ${remaining.v}.${remaining.a}.${remaining.r}.${remaining.p}`);

      const newItem = parseWeight(await ask("📦 Enter new item weight (vori.ana.roti.point): "));
      const newItemPoints = toPoints(newItem.v, newItem.a, newItem.r, newItem.p);

      if (remainingPoints > newItemPoints) {
        console.log("❌ Remaining weight is more than new item weight. Invalid operation.");
        rl.close();
        return;
      }

      const netItemPoints = newItemPoints - remainingPoints;
      const netItem = fromPoints(Math.round(netItemPoints));

      console.log(`🧮 Net item weight (new - remaining): ${netItem.v}.${netItem.a}.${netItem.r}.${netItem.p}`);

      const pricePerVori = parseFloat(await ask("💰 Enter silver price per vori: "));
      const totalPrice = (netItemPoints / POINTS_PER_VORI) * pricePerVori;

      console.log(`💸 Total price for net item: ${totalPrice.toFixed(2)}`);
    } else {
      console.log("❌ Invalid option.");
    }
  } catch (err) {
    console.log(err.message);
  }

  rl.close();
})();
