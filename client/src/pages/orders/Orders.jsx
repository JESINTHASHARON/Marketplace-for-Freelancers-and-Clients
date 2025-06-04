import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await newRequest.get(`/orders`);
      return res.data;
    },
  });

  const handleClickTitle = (order) => {
    if (currentUser.user.isSeller) {
      navigate(`/order/${order.id}`);
    } else {
      if (order.gigExists) {
        navigate(`/gig/${order.gigId}`);
      }
    }
  };

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.user.isSeller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  const handlePayment = (orderId) => {
    navigate(`/pay/${orderId}`); // Adjust the path if needed
  };

  return (
    <div className="orders">
      <div className="container">
        <h1>{currentUser.user.isSeller ? "Received Orders" : "Your Orders"}</h1>
        {isLoading ? (
          "Loading..."
        ) : error ? (
          "Something went wrong!"
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Contact</th>
                <th>Status</th> {/* New Status Column */}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <img className="image" src={order.img} alt="" />
                    </td>
                    <td>
                      <span
                        className="link"
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => handleClickTitle(order)}
                      >
                        {currentUser.user.isSeller
                          ? order.title
                          : order.gigExists
                          ? order.title
                          : "Gig deleted"}
                      </span>
                    </td>
                    <td>{order.price}</td>
                    <td>
                      <img
                        className="message"
                        src="/img/message.png"
                        alt=""
                        onClick={() => handleContact(order)}
                      />
                    </td>
                    {/* <td>
                      {currentUser.user.isSeller ? (
                        order.isCompleted ? (
                          <span title="Completed" style={{ color: "green" }}>✅</span>
                        ) : (
                          <span title="Waiting for submission" style={{ color: "orange" }}>⏳</span>
                        )
                      ) : !order.isPaid ? (
                        <button
                          onClick={() => handlePayment(order.id)}
                          style={{
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Pay Now
                        </button>
                      ) : !order.isCompleted ? (
                        <span title="Waiting for delivery" style={{ color: "orange" }}>⏳</span>
                      ) : (
                        <span title="Paid & Delivered" style={{ color: "green" }}>✅</span>
                      )}
                    </td> */}
                    <td>
                      {currentUser.user.isSeller ? (
                        order.isCompleted ? (
                          <span title="Completed" style={{ color: "green" }}>✅</span>
                        ) : (
                          <span title="Waiting for submission" style={{ color: "orange" }}>⏳</span>
                        )
                      ) : !order.isCompleted ? (
                        <button
                          disabled
                          style={{
                            backgroundColor: "#ffc107",
                            color: "black",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            cursor: "not-allowed",
                          }}
                        >
                          ⏳ Wait
                        </button>
                      ) : !order.isPaid ? (
                        <button
                          onClick={() => handlePayment(order.id)}
                          style={{
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Pay Now
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/download/${order.id}`)} // or final view page
                          style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          ✅ Click
                        </button>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
