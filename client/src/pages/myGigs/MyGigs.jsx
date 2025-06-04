import React from "react";
import { Link } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import newRequest from "../../utils/newRequest";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

function MyGigs() {
  const currentUser = getCurrentUser();
  const [showModal, setShowModal] = useState(false);
  const [gigToDelete, setGigToDelete] = useState(null);
  
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
      newRequest.get(`/gigs?userId=${currentUser.user.id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/gigs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const confirmDeleteGig = (id) => {
    setGigToDelete(id);
    setShowModal(true);
  };
  
  const handleConfirm = () => {
    setShowModal(false);
    mutation.mutate(gigToDelete);
  };
  

  return (
    <div className="myGigs">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Gigs</h1>
            {currentUser.user.isSeller && (
              <Link to="/add">
                <button>Add New Gig</button>
              </Link>
            )}
          </div>
          <table>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Sales</th>
              <th>Action</th>
            </tr>
            {data.map((gig) => (
              <tr key={gig.id}>
                <td>
                  <img className="image" src={gig.cover} alt="" />
                </td>
                <td>{gig.title}</td>
                <td>{gig.price}</td>
                <td>{gig.sales}</td>
                <td>
                  <img
                    className="delete"
                    src="./img/delete.png"
                    alt=""
                    onClick={() => confirmDeleteGig(gig.id)}
                  />
                </td>
              </tr>
            ))}
          </table>
        </div>
      )}
          {showModal && (
      <ConfirmModal onClose={() => setShowModal(false)} onConfirm={handleConfirm} />
    )}
    </div>
  );
}

export default MyGigs;
