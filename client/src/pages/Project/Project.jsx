import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Project.scss";

function Project() {
  const { id } = useParams();
  const [bidAmount, setBidAmount] = useState(0);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();

  // Fetch project details
  const {
    data: project,
    isLoading: isProjectLoading,
    error: projectError,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => newRequest.get(`/projects/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  // Fetch seller details
  const {
    data: seller,
    isLoading: isSellerLoading,
    error: sellerError,
  } = useQuery({
    queryKey: ["seller", project?.userId],
    queryFn: () =>
      newRequest.get(`/users/${project.userId}`).then((res) => res.data),
    enabled: !!project?.userId,
  });

  // Fetch existing bid status
  const {
    data: existingBids,
    isLoading: isBidStatusLoading,
    error: bidStatusError,
  } = useQuery({
    queryKey: ["userBid", currentUser?.user.id, id],
    queryFn: () =>
      newRequest
        .get(`/bids/check?freelancerId=${currentUser?.user.id}&projectId=${id}`)
        .then((res) => res.data),
    enabled: !!currentUser?.user.id && !!id,
  });

  // Mutation to place a bid
  const mutation = useMutation({
    mutationFn: (newBid) => newRequest.post("/bids", newBid),
    onSuccess: () => {
      alert("Bid placed successfully!");
      queryClient.invalidateQueries(["userBid", currentUser?.user.id, id]);
    },
    onError: () => {
      alert("Failed to place bid.");
    },
  });

  const handleBid = () => {
    if (bidAmount <= 0) {
      alert("Please enter a valid bid amount");
      return;
    }

    const newBid = {
      amount: bidAmount,
      projectId: parseInt(id),
      freelancerId: currentUser.user.id,
    };

    mutation.mutate(newBid);
  };

  if (isProjectLoading || isSellerLoading || isBidStatusLoading)
    return <div>Loading...</div>;
  if (projectError || sellerError || bidStatusError)
    return <div>Something went wrong!</div>;

  return (
    <div className="projectDetail">
      <div className="container">
        <h1>{project.title}</h1>
        <p>{project.description}</p>

        <div className="projectInfo">
          <h3>Details</h3>
          <p><strong>Category:</strong> {project.category}</p>
          <p><strong>Budget:</strong> Rs. {project.budget}</p>
          <p><strong>Created At:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="sellerInfo">
          <h3>Project Client</h3>
          <div className="user">
            <img src={seller?.img || "/img/noavatar.jpg"} alt="Client" />
            <span>{seller?.username}</span>
          </div>
          <p>{seller?.desc || "No description available."}</p>
          <p><strong>Email:</strong> {seller?.email}</p>
        </div>

        <div className="bidSection">
          {existingBids?.hasBid ? (
            <button disabled>You already placed a bid</button>
          ) : (
            <>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(parseInt(e.target.value))}
                placeholder="Enter your bid amount"
              />
              <button onClick={handleBid}>Place Bid</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Project;
