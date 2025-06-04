import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Bids.scss";

const Bids = () => {
  const { projectId, projectTitle } = useParams();
  const [bids, setBids] = useState([]);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const { isLoading, error, data } = useQuery({
    queryKey: ["bids", projectId],
    queryFn: async () => {
      const res = await newRequest.get(`/projects/${projectId}/bids`);
      return res.data;
    },
  });

  useEffect(() => {
    if (data) {
      setBids(data);
    }
  }, [data]);

  const handleBidAction = async (bidId, action) => {
    try {
      await newRequest.put(`/bids/${bidId}/${action}`);
      if (action === "reject") {
        setBids((prev) => prev.filter((bid) => bid.id !== bidId));
      } else if (action === "accept") {
        setBids((prev) =>
          prev.map((bid) =>
            bid.id === bidId ? { ...bid, status: "ACCEPT" } : bid
          )
        );
      }
    } catch (err) {
      console.error("Bid action failed:", err);
    }
  };

  const handleMessage = async (freelancerId) => {
    const sellerId = currentUser.user.id;
    const buyerId = freelancerId;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        try {
          const res = await newRequest.post(`/conversations/`, {
            to: freelancerId,
          });
          navigate(`/message/${res.data.id}`);
        } catch (err) {
          console.error("Failed to start conversation:", err);
        }
      } else {
        console.error("Message fetch error:", err);
      }
    }
  };

  return (
    <div className="bids-container">
      <h1 className="bids-title">Bids for Project {projectTitle}</h1>

      {isLoading ? (
        <p>Loading bids...</p>
      ) : error ? (
        <p>Something went wrong!</p>
      ) : bids.length > 0 ? (
        <div className="bid-cards">
          {bids.map((bid) => (
            <div className="bid-card" key={bid.id}>
              <div className="bidder-info">
                <Link to={`/user/${bid.freelancerId}`} className="profile-link">
                  <img
                    src={bid.freelancer?.img || "/default-avatar.png"}
                    alt={bid.freelancer?.username || "User"}
                    className="profile-img"
                  />
                </Link>
                <div>
                  <h3>
                    {bid.freelancer?.username || "Unknown User"}{" "}
                    <span
                      title="Message Freelancer"
                      style={{ cursor: "pointer", fontSize: "16px", marginLeft: "6px" }}
                      onClick={() => handleMessage(bid.freelancerId)}
                    >
                      💬
                    </span>
                  </h3>
                  <p>Bid: ₹{bid.amount}</p>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  className="accept-btn"
                  disabled={bid.status === "ACCEPT"}
                  onClick={() => handleBidAction(bid.id, "accept")}
                >
                  {bid.status === "ACCEPT" ? "Accepted" : "Accept"}
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleBidAction(bid.id, "reject")}
                >
                  Reject
                </button>
                {bid.status === "ACCEPT" && (
                  <Link
                    to={`/projects/${projectId}/assign/${bid.freelancerId}`}
                    className="assign-btn"
                  >
                    Assign Modules
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No bids found.</p>
      )}
    </div>
  );
};

export default Bids;
