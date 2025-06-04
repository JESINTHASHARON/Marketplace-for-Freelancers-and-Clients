import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./DownloadWork.scss";

const DownloadWork = () => {
  const { id } = useParams(); // order ID
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await newRequest.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        setError("Failed to load order.");
      }
    };
    fetchOrder();
  }, [id]);

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      await newRequest.put(`/orders/${id}/mark-paid`);
      setOrder((prev) => ({ ...prev, isPaid: true }));
    } catch (err) {
      setError("Payment failed.");
    }
    setIsPaying(false);
  };

  return (
    <div className="downloadWork">
      <div className="container">
        <h2>Final Delivery</h2>
        {error && <p className="error">{error}</p>}
        {order ? (
          <>
            <p><strong>Note from Seller:</strong></p>
            <p>{order.deliveryNote}</p>

            {!order.isPaid ? (
              <button onClick={handlePayment} disabled={isPaying}>
                {isPaying ? "Processing..." : "Pay & Unlock File"}
              </button>
            ) : (
              <a href={order.finalFileUrl} download target="_blank" rel="noopener noreferrer">
                <button>Download Final Work</button>
              </a>
            )}
          </>
        ) : (
          <p>Loading order info...</p>
        )}
      </div>
    </div>
  );
};

export default DownloadWork;
