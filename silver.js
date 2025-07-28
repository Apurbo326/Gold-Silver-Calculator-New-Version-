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
    alert(`❌ Invalid input: ana ≤ 15, roti ≤ 5, point ≤ 9. You entered ${v}.${a}.${r}.${p}`);
    throw new Error("Invalid weight format.");
  }
  return { v, a, r, p };
}

function calculateSilverValue() {
  try {
    const silverPrice = parseFloat(document.getElementById("priceInput").value);

    const newItem = parseWeight(document.querySelectorAll("#weightInput")[0].value);
    const oldItem = parseWeight(document.querySelectorAll("#weightInput")[1].value);
    const lossPerVori = parseWeight(document.getElementById("laborCostInput").value);

    const newPoints = toPoints(newItem.v, newItem.a, newItem.r, newItem.p);
    const oldPoints = toPoints(oldItem.v, oldItem.a, oldItem.r, oldItem.p);
    const lossPoints = toPoints(lossPerVori.v, lossPerVori.a, lossPerVori.r, lossPerVori.p);

    // Calculate total remaining silver after loss
    const oldWeightAfterLossPoints = oldPoints - ((oldPoints / POINTS_PER_VORI) * lossPoints);

    const remainingPoints = Math.round(oldWeightAfterLossPoints);
    const remaining = fromPoints(remainingPoints);

    const remainingWeightStr = `${remaining.v}.${remaining.a}.${remaining.r}.${remaining.p}`;
    document.getElementById("display").value = remainingWeightStr;

    // Now calculate how much new silver needs to be bought
    if (remainingPoints > newPoints) {
      alert("❌ Remaining silver is more than new item. No need to buy more.");
      document.getElementById("totalWeightInGram").value = "0.0.0.0";
      document.getElementById("costPerGram").value = "0.00";
      return;
    }

    const netPoints = newPoints - remainingPoints;
    const netWeight = fromPoints(netPoints);
    const netWeightStr = `${netWeight.v}.${netWeight.a}.${netWeight.r}.${netWeight.p}`;

    document.getElementById("totalWeightInGram").value = netWeightStr;

    // Calculate total price
    const totalPrice = (netPoints / POINTS_PER_VORI) * silverPrice;
    document.getElementById("costPerGram").value = totalPrice.toFixed(2);

  } catch (err) {
    console.error(err);
  }
}
