"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface FormState {
    amount: string;
    baseCoinSymbol: string;
    quoteCoinSymbol: string;
    receiveAmount: string;
    address: string;
    network: "TESTNET" | "MAINNET";
    pairId?: string;
    paymentRouteId?: string; // ⬅️ Tambahkan ini
    paymentAddress?: string;
    protocol?: string;
    orderId?: string;
    orderHash?: string;
}

interface Props {
    data: FormState;
    onChange: (form: FormState) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step2_AddressForm({
    data,
    onChange,
    onNext,
    onBack
}: Props) {
    const [loading, setLoading] = useState(false);
    // Harus punya paymentRouteId dan pairId baru valid!
    const isValid =
        data.address?.length > 0 && !!data.pairId && !!data.paymentRouteId;

    const handleCreateOrder = async () => {
        if (!isValid || loading) return;

        setLoading(true);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseFloat(data.amount),
                    addressDestination: data.address,
                    pairId: data.pairId,
                    network: data.network,
                    paymentRouteId: data.paymentRouteId // ⬅️ Jangan lupa ini
                })
            });

            if (!res.ok) {
                const err = await res.json();
                alert("Gagal membuat order: " + err.error);
                setLoading(false);
                return;
            }
            const order = await res.json();
            onChange({
                ...data,
<<<<<<< ours
<<<<<<< ours
                orderHash: order.orderHash,
                orderId: order.id,
                paymentAddress: order.paymentAddress,
                protocol: order.paymentRoute.protocol,
=======
                orderId: order.id,
                orderHash: order.orderHash
>>>>>>> theirs
=======
                orderHash: order.orderHash,
                orderId: order.id,
                paymentAddress: order.paymentRoute?.address,
                protocol: order.paymentRoute?.protocol,
>>>>>>> theirs
            });
            onNext();
        } catch (err) {
            console.error("Order creation failed:", err);
            alert("Terjadi kesalahan saat membuat order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-4 py-6 max-w-md mx-auto text-sm bg-[#f9f9fb] min-h-screen">
            <div className="mb-3 text-gray-600 text-sm leading-relaxed">
                Langkah kedua, masukkan alamat wallet yang akan menerima aset
                kripto. Pastikan alamat tersebut sesuai dengan jaringan{" "}
                {data.network.toLowerCase()} dan jenis koin{" "}
                {data.quoteCoinSymbol}.
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                <button
                    className="text-sm mb-3 text-blue-600 font-medium"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <h2 className="text-base font-semibold text-gray-800 mb-4">
                    Enter address <span className="text-blue-500">2/3</span>
                </h2>

                <div className="mb-3">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {data.network}
                    </span>
                </div>

                <div className="bg-gray-100 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">
                            You send {data.amount} {data.baseCoinSymbol}
                        </p>
                        <p className="text-sm text-gray-500">
                            You get ~ {data.receiveAmount}{" "}
                            {data.quoteCoinSymbol}
                        </p>
                    </div>
                    <ArrowRight className="text-2xl text-green-500" />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-600">
                        Destination address ({data.quoteCoinSymbol})
                        <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                        type="text"
                        value={data.address}
                        onChange={e =>
                            onChange({ ...data, address: e.target.value })
                        }
                        placeholder={`Enter your ${data.quoteCoinSymbol} address`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-yellow-800">
                        ⚠️ Please make sure the address supports{" "}
                        {data.quoteCoinSymbol} on {data.network}. Sending to a
                        wrong address may result in permanent loss of funds.
                    </p>
                </div>

                <button
                    onClick={handleCreateOrder}
                    disabled={!isValid || loading}
                    className={`w-full mt-5 py-3 rounded-xl text-base font-semibold ${
                        isValid && !loading
                            ? "bg-green-300 hover:bg-green-400 text-black"
                            : "bg-green-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    {loading ? "Creating Order..." : "Next step"}
                </button>
            </div>
        </div>
    );
}
