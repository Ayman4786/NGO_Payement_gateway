const PDFDocument = require("pdfkit");

async function generateReceipt(donorName, amount, orderId, paymentId) {
  const doc = new PDFDocument();

  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));

  doc.fontSize(20).text("Donation Receipt", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Donor Name: ${donorName}`);
  doc.text(`Amount Donated: ₹${amount}`);
  doc.text(`Order ID: ${orderId}`);
  doc.text(`Payment ID: ${paymentId}`);

  doc.moveDown();
  doc.text("Thank you for supporting our NGO.");

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
  });
}

module.exports = generateReceipt;