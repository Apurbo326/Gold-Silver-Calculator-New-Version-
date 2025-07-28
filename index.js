function calculateGoldValue() {
    // Get input values
    var inputWeight = document.getElementById("weightInput").value;
    var pricePerBhori = parseFloat(document.getElementById("priceInput").value);
    var laborCostPerBhori = parseFloat(document.getElementById("laborCostInput").value);

    // Validate input
    try {
        if (!inputWeight || isNaN(pricePerBhori)) {
            throw new Error("Check Inputs!");
        }

        validateInput(inputWeight);

        if (isNaN(laborCostPerBhori)) {
            laborCostPerBhori = 0;
            document.getElementById("laborCostInput").value = 0;
        }

        if (parseFloat(inputWeight) < 0 || pricePerBhori < 0) {
            throw new Error("Invalid Inputs!");
        }
    } catch (error) {
        document.getElementById("display").value = "Error: " + error.message;
        document.getElementById("totalWeightInGram").value = "Error: " + error.message;
        document.getElementById("costPerGram").value = "Error: " + error.message;
        return;
    }

    // Calculate the total value of the gold
    var totalValue = calculateGoldValueHelper(inputWeight, pricePerBhori, laborCostPerBhori);

    // Calculate and display total weight in grams
    var totalWeightInGrams = convertToGrams(inputWeight);

    // Calculate cost per gram
    var calculatedCostPerGram = costPerGram(inputWeight, pricePerBhori);

    // Display the result
    document.getElementById("display").value = totalValue.toFixed(4);
    document.getElementById("totalWeightInGram").value = totalWeightInGrams.toFixed(4);
    document.getElementById("costPerGram").value = calculatedCostPerGram.toFixed(4);
}

function validateInput(inputWeight) {
    var parts = inputWeight.split(".");
    var weightInAna = parseFloat(parts[1]);
    var weightInRoti = parseFloat(parts[2]);
    var weightInPoint = parseFloat(parts[3]);

    if (weightInAna > 15 || weightInRoti > 5 || weightInPoint > 9) {
        throw new Error("Please Correct Weight!");
    }
}

function calculateGoldValueHelper(inputWeight, pricePerBhori, laborCostPerBhori) {
    // Split the input string into bhori, ana, roti, and point
    var parts = inputWeight.split(".");

    // Convert each part to its respective value
    var weightInBhori = parseFloat(parts[0]);
    var weightInAna = parseFloat(parts[1]);
    var weightInRoti = parseFloat(parts[2]);
    var weightInPoint = parseFloat(parts[3]);

    // Calculate the total weight in points
    var totalWeightInPoints = weightInBhori * 16 * 6 * 10 + weightInAna * 6 * 10 + weightInRoti * 10 + weightInPoint;

    // Calculate the total value of the gold
    return totalWeightInPoints * ((pricePerBhori + laborCostPerBhori) / (16 * 6 * 10));
}

function convertToGrams(inputWeight) {
    // Split the input string into bhori, ana, roti, and point
    var parts = inputWeight.split(".");

    // Convert each part to its respective value
    var weightInBhori = parseFloat(parts[0]);
    var weightInAna = parseFloat(parts[1]);
    var weightInRoti = parseFloat(parts[2]);
    var weightInPoint = parseFloat(parts[3]);

    // Calculate the total weight in grams
    var totalWeightInGrams = weightInBhori * 11.6638 + (weightInAna * 11.6638) / 16 + (weightInRoti * 11.6638) / 96 + (weightInPoint * 11.6638) / 960;

    return totalWeightInGrams;
}

function costPerGram(inputWeight, pricePerBhori) {
    var parts = inputWeight.split(".");

    // Convert each part to its respective value
    var weightInBhori = parseFloat(parts[0]);
    var weightInAna = parseFloat(parts[1]);
    var weightInRoti = parseFloat(parts[2]);
    var weightInPoint = parseFloat(parts[3]);

    // Calculate the total weight in points
    var totalWeightInPoints = weightInBhori * 16 * 6 * 10 + weightInAna * 6 * 10 + weightInRoti * 10 + weightInPoint;

    // Calculate the total weight in grams
    var totalWeightInGrams = weightInBhori * 11.6638 + (weightInAna * 11.6638) / 16 + (weightInRoti * 11.6638) / 96 + (weightInPoint * 11.6638) / 960;

    // Calculate the total value of the gold
    return (totalWeightInPoints * ((pricePerBhori) / (16 * 6 * 10))) / totalWeightInGrams;
}

function generateBill() {
    var { jsPDF } = window.jspdf;
    var doc = new jsPDF();

    // Business information
    var businessName = "Rajlaxmi Jewellers";
    var businessAddress = "College Road, Ishwardi-6620, Bangladesh";
    var businessPhone = "+880 1715-170799";
    var businessEmail = "ishwardi.rajlaxmijewellers@gmail.com";

    // Get customer information
    var customerName = document.getElementById("customerName").value;
    var customerPhone = document.getElementById("customerPhone").value;

    // Get calculation results
    var totalValue = document.getElementById("display").value;
    var totalWeightInGrams = document.getElementById("totalWeightInGram").value;
    var calculatedCostPerGram = document.getElementById("costPerGram").value;

    // Input values
    var inputWeight = document.getElementById("weightInput").value;
    var pricePerBhori = document.getElementById("priceInput").value;
    var laborCostPerBhori = document.getElementById("laborCostInput").value;

    // Get the last bill number from local storage or initialize it
    var lastBillNumber = localStorage.getItem("lastBillNumber");
    if (lastBillNumber === null) {
        lastBillNumber = 0;
    } else {
        lastBillNumber = parseInt(lastBillNumber);
    }

    // Increment the bill number
    var uniqueBillNumber = lastBillNumber + 1;

    // Save the new bill number back to local storage
    localStorage.setItem("lastBillNumber", uniqueBillNumber);

    // Define bill details as a 2D array for the table
    var billDetails = [
        ["Gold Price (per Bhori)", pricePerBhori],
        ["Gold Weight", inputWeight],
        ["Making Charge (per Bhori)", laborCostPerBhori],
        ["Total Weight (in Grams)", totalWeightInGrams],
        ["Cost Per Gram (Without Making Charge)", calculatedCostPerGram],
        ["Total Cost (BDT)", totalValue]
    ];

    // Set font styles
    doc.setFont("helvetica", "normal");

    // Header
    doc.setFontSize(22);
    doc.text(businessName, 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.text(businessAddress, 105, 30, null, null, "center");
    doc.text(`Phone: ${businessPhone}`, 105, 40, null, null, "center");
    doc.text(`Email: ${businessEmail}`, 105, 50, null, null, "center");

    // Customer information
    doc.setFontSize(14);
    doc.text(`Customer Name: ${customerName}`, 15, 80);
    doc.text(`Customer Phone: ${customerPhone}`, 15, 90);

    // Bill number
    doc.text(`Bill Number: ${uniqueBillNumber}`, 15, 100);

    // Bill details table
    doc.autoTable({
        startY: 120,
        head: [["Description", "Details"]],
        body: billDetails,
        theme: "plain",
        styles: {
            lineWidth: 1  // Set border width to 1 pixel
        },
        columnStyles: {
            0: { fontStyle: "bold" },
            1: { fontStyle: "normal" }
        }
    });

    // Bill date and time
    var today = new Date();
    var formattedDateTime = `${today.getFullYear()}-${('0' + (today.getMonth() + 1)).slice(-2)}-${('0' + today.getDate()).slice(-2)}_(${('0' + today.getHours()).slice(-2)}-${('0' + today.getMinutes()).slice(-2)}-${('0' + today.getSeconds()).slice(-2)})`;
    doc.setFontSize(10);
    doc.text(`Bill Date and Time: ${formattedDateTime}`, 15, doc.autoTable.previous.finalY + 10);

    // Footer
    doc.setFontSize(8);
    doc.text("Thank you for your business!", 105, doc.internal.pageSize.height - 10, null, null, "center");

    // Generate the filename as before
    var filename = `${formattedDateTime}_${customerName}_${customerPhone}.pdf`;

    // Save the PDF
    doc.save(filename);
}
