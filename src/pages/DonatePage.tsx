import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const DonatePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Make a Donation
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            Full Name
          </label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">
            Email Address
          </label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium">
            Donation Amount (₹)
          </label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
            onClick={async () => {

              if (loading) return;
                  setLoading(true);
          
                const res = await fetch("http://localhost:5000/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    donorName: name,
                    donorEmail: email,
                    amount: Number(amount),
                }),
                });

                const data = await res.json();

                // Backend validation errors
                if (!res.ok) {
                  alert(data.errors?.[0]?.msg || "Something went wrong");
                  setLoading(false);
                  return;
                }

                // 🔒 Safety check for order creation
                if (!data.order) {
                  alert("Unable to start payment. Please try again.");
                  setLoading(false);
                  return;
                }

                const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: "INR",
                name: "Voice of Nation Foundation",
                order_id: data.order.id,
                handler: async function (response: any) {
                    // 1️⃣ Call backend after successful payment
                    await fetch("http://localhost:5000/payment-success", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        donorName: name,
                        donorEmail: email,
                        amount: Number(amount),
                        orderId: data.order.id,
                        paymentId: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    }),
                    });

                    setLoading(false);
                    // 2️⃣ Final user confirmation
                    alert("Donation Successful! Receipt sent to your email.");
                },

                prefill: {
                    name,
                    email,
                },

                theme: {
                    color: "#dc2626",
                },
                };

                const rzp = new window.Razorpay(options);

                rzp.on("payment.failed", function () {
                  setLoading(false);
                  alert("Amount exceeding \nPayment failed or cancelled.");
                });
                rzp.open();
            }}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
            {loading ? "Processing..." : "Donate Now"}
        </button>
      </div>
    </div>
  );
};

export default DonatePage;
