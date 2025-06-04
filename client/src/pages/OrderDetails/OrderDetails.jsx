import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./OrderDetails.scss";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [url, setUrl] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await newRequest.get(`/orders/details/${id}`);
        setOrder(res.data);
        setUrl(res.data.order.workUrl || "");
        setIsCompleted(res.data.order.isCompleted);
      } catch (err) {
        console.error("Failed to fetch order details", err);
      }
    };

    fetchOrder();
  }, [id]);

  const isValidUrl = (url) => {
    const patterns = [
      /^https:\/\/(drive\.google\.com)\/.+$/,
      /^https:\/\/(www\.)?dropbox\.com\/.+$/,
      /^https:\/\/(www\.)?youtube\.com\/watch\?v=.+$/,
      /^https:\/\/(www\.)?youtu\.be\/.+$/,
      /^https:\/\/(www\.)?github\.com\/.+$/,
      /^https:\/\/(www\.)?figma\.com\/.+$/,
      /^https:\/\/(www\.)?notion\.so\/.+$/,
      /^https:\/\/.+\..+$/, // fallback for general HTTPS links
    ];

    return patterns.some((pattern) => pattern.test(url));
  };

  const handleComplete = async () => {
    try {
      if (!url || !isValidUrl(url)) {
        setMessage("Please enter a valid URL before completing.");
        return;
      }

      // Save work URL to the order
      await newRequest.put(`/orders/upload-work/${id}`, { fileUrl: url });

      setIsCompleted(true);
      setMessage("Order marked as completed.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error marking as completed", err);
      setMessage("Something went wrong.");
    }
  };

  if (!order) return <div>Loading...</div>;

  const { buyer, deliveryDeadline, timeLeftInMs, requirements } = order;
  return (
    
    <div className="order-details">
      <h2>Order Details</h2>

      <div className="section">
        <h3>Buyer Info</h3>
        <p><strong>Name:</strong> {buyer.username}</p>
        <p><strong>Email:</strong> {buyer.email}</p>
        <p><strong>Country:</strong> {buyer.country}</p>
      </div>

      <div className="section">
        <h3>Requirements</h3>
        <p>{requirements || "No requirements submitted yet."}</p>
      </div>

      <div className="section">
        <h3>Time Left</h3>
        <p>
          {timeLeftInMs > 0
            ? `${Math.floor(timeLeftInMs / (1000 * 60 * 60))} hours left`
            : "Deadline passed"}
        </p>
        <p><strong>Deadline:</strong> {new Date(deliveryDeadline).toLocaleString()}</p>
      </div>

      <div className="section">
        <h3>Submit Final Work (URL only)</h3>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter work URL"
          disabled={isCompleted}
        />
        {url && !isValidUrl(url) && !isCompleted && (
          <p style={{ color: "red", fontSize: "14px" }}>
            Please enter a valid URL (Google Drive, Dropbox, YouTube, GitHub, etc.)
          </p>
        )}
      </div>

      <div className="section checkbox-section">
        <label>
          <input
            type="checkbox"
            onChange={handleComplete}
            disabled={isCompleted || !isValidUrl(url)}
            checked={isCompleted}
          />
          Mark as Completed
        </label>
        {!isValidUrl(url) && !isCompleted && (
          <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
            You must enter a valid URL before marking as completed.
          </p>
        )}
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default OrderDetails;
