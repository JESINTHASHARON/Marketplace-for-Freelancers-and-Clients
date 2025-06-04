import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest"; // Axios instance or fetch wrapper
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaUser } from 'react-icons/fa'; // Add icons for better visuals
import "./UserProfile.scss"
const UserProfile = () => {
  const { id } = useParams(); // Get the user ID from the URL parameters

  // State variables to hold the user data
  const [user, setUser] = useState(null);
  const [userGigs, setUserGigs] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to fetch user data on component mount and when `id` changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true); // Set loading state to true before API calls

        // Fetch user details, gigs, and reviews using the custom API utility
        const userRes = await newRequest.get(`/users/userdetails/${Number(id)}`);
        const gigsRes = await newRequest.get(`/gigs/user/${id}`);
        const reviewsRes = await newRequest.get(`/reviews/user/${id}`);

        // Set the fetched data into state variables
        setUser(userRes.data);
        setUserGigs(gigsRes.data);
        setUserReviews(reviewsRes.data);
      } catch (err) {
        // In case of an error, set the error state
        setError("Failed to load user data.");
        console.error(err);
      } finally {
        setIsLoading(false); // Set loading to false after API call completion
      }
    };

    fetchUserProfile(); // Call the fetch function
  }, [id]); // Re-run when `id` changes (e.g., when a new user is viewed)

  // If the component is loading, display a loading message
  if (isLoading) return <div className="loading">Loading user profile...</div>;

  // If there's an error, display the error message
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-profile">
      <h2>{user?.username}'s Profile</h2>

      <div className="profile-section">
        <div className="profile-image">
          <img
            src={user?.img || "/default-profile.png"}
            alt="Profile"
          />
        </div>

        <div className="profile-details">
          <div className="profile-card">
            <FaUser className="icon" />
            <p><strong>Name:</strong> {user?.username}</p>
          </div>
          <div className="profile-card">
            <FaEnvelope className="icon" />
            <p><strong>Email:</strong> {user?.email}</p>
          </div>
          <div className="profile-card">
            <FaMapMarkerAlt className="icon" />
            <p><strong>Country:</strong> {user?.country}</p>
          </div>
          <div className="profile-card">
            <FaPhoneAlt className="icon" />
            <p><strong>Phone:</strong> {user?.phone || "N/A"}</p>
          </div>
          <div className="profile-card">
            <p><strong>Description:</strong> {user?.desc || "No description provided."}</p>
          </div>
          <div className="profile-card">
            <p><strong>Role:</strong> {user?.isSeller ? "Seller" : "Client"}</p>
          </div>
        </div>
      </div>

      <hr />

      {/* Gigs Section */}
      <h3>User Gigs</h3>
      {userGigs?.length > 0 ? (
        userGigs.map((gig) => (
          <div key={gig.id} className="gig-card">
            <h4>{gig.title}</h4>
            <p>{gig.shortDesc}</p>
          </div>
        ))
      ) : (
        <p>No gigs found.</p>
      )}

      <hr />

      {/* Reviews Section */}
      <h3>User Reviews</h3>
      {userReviews?.length > 0 ? (
        userReviews.map((review) => (
          <div key={review.id} className="review-card">
            <p><strong>Rating:</strong> {review.star} / 5</p>
            <p>{review.desc}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default UserProfile;
