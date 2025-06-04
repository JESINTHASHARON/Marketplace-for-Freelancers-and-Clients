// import React from "react";
// import "./Gig.scss";
// import { Slider } from "infinite-react-carousel/lib";
// import { Link, useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import newRequest from "../../utils/newRequest";
// import Reviews from "../../components/reviews/Reviews";
// import { useNavigate } from "react-router-dom";
// function Gig() {
  
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const handleOrder = async () => {
//     try {
//       const res = await newRequest.post(`/orders/create/${id}`);
//       console.log(res.data.id);
//       navigate(`/submit-requirements/${res.data.id}`);
//     } catch (err) {
//       console.error("Failed to create order:", err);
//     }
//   };
  

//   const { isLoading, error, data } = useQuery({
//     queryKey: ["gig",id],
//     queryFn: () =>
//       newRequest.get(`/gigs/single/${id}`).then((res) => {
//         return res.data;
//       }),
//   });

//   const userId = data?.userId;

//   const {
//     isLoading: isLoadingUser,
//     error: errorUser,
//     data: dataUser,
//   } = useQuery({
//     queryKey: ["user"],
//     queryFn: () =>
//       newRequest.get(`/users/${userId}`).then((res) => {
//         return res.data;
//       }),
//     enabled: !!userId,
//   });

//   return (
//     <div className="gig">
//       {isLoading ? (
//         "loading"
//       ) : error ? (
//         "Something went wrong!"
//       ) : (
//         <div className="container">
//           <div className="left">
//             <span className="breadcrumbs">
//               GigOrbit {">"} Graphics & Design {">"}
//             </span>
//             <h1>{data.title}</h1>
//             {isLoadingUser ? (
//               "loading"
//             ) : errorUser ? (
//               "Something went wrong!"
//             ) : (
//               <div className="user">
//                 <img
//                   className="pp"
//                   src={dataUser.img || "/img/noavatar.jpg"}
//                   alt=""
//                 />
//                 <span>{dataUser.username}</span>
//                 {!isNaN(data.totalStars / data.starNumber) && (
//                   <div className="stars">
//                     {Array(Math.round(data.totalStars / data.starNumber))
//                       .fill()
//                       .map((item, i) => (
//                         <img src="/img/star.png" alt="" key={i} />
//                       ))}
//                     <span>{Math.round(data.totalStars / data.starNumber)}</span>
//                   </div>
//                 )}
//               </div>
//             )}
//             <Slider slidesToShow={1} arrowsScroll={1} className="slider">
//             {Array.isArray(data?.images) && data.images.length > 0 ? (
//   <Slider slidesToShow={1} arrowsScroll={1} className="slider">
//     {data.images.map((img) => (
//       <img key={img} src={img} alt="" />
//     ))}
//   </Slider>
// ) : (
//   <p>No images available</p>
// )}
//             </Slider>
//             <h2>About This Gig</h2>
//             <p>{data.desc}</p>
//             {isLoadingUser ? (
//               "loading"
//             ) : errorUser ? (
//               "Something went wrong!"
//             ) : (
//               <div className="seller">
//                 <h2>About The Seller</h2>
//                 <div className="user">
//                   <img src={dataUser.img || "/img/noavatar.jpg"} alt="" />
//                   <div className="info">
//                     <span>{dataUser.username}</span>
//                     {!isNaN(data.totalStars / data.starNumber) && (
//                       <div className="stars">
//                         {Array(Math.round(data.totalStars / data.starNumber))
//                           .fill()
//                           .map((item, i) => (
//                             <img src="/img/star.png" alt="" key={i} />
//                           ))}
//                         <span>
//                           {Math.round(data.totalStars / data.starNumber)}
//                         </span>
//                       </div>
//                     )}
//                     <button>Contact Me</button>
//                   </div>
//                 </div>
//                 <div className="box">
//                   <div className="items">
//                     <div className="item">
//                       <span className="title">From</span>
//                       <span className="desc">{dataUser.country}</span>
//                     </div>
//                     <div className="item">
//                       <span className="title">Member since</span>
//                       <span className="desc">Aug 2022</span>
//                     </div>
//                     <div className="item">
//                       <span className="title">Avg. response time</span>
//                       <span className="desc">4 hours</span>
//                     </div>
//                     <div className="item">
//                       <span className="title">Last delivery</span>
//                       <span className="desc">1 day</span>
//                     </div>
//                     <div className="item">
//                       <span className="title">Languages</span>
//                       <span className="desc">English</span>
//                     </div>
//                   </div>
//                   <hr />
//                   <p>{dataUser.desc}</p>
//                 </div>
//               </div>
//             )}
//             <Reviews gigId={id} />
//           </div>
//           <div className="right">
//             <div className="price">
//               <h3>{data.shortTitle}</h3>
//               <h2>$ {data.price}</h2>
//             </div>
//             <p>{data.shortDesc}</p>
//             <div className="details">
//               <div className="item">
//                 <img src="/img/clock.png" alt="" />
//                 <span>{data.deliveryDate} Days Delivery</span>
//               </div>
//               <div className="item">
//                 <img src="/img/recycle.png" alt="" />
//                 <span>{data.revisionNumber} Revisions</span>
//               </div>
//             </div>
//             <div className="features">
//               {data.features.map((feature) => (
//                 <div className="item" key={feature}>
//                   <img src="/img/greencheck.png" alt="" />
//                   <span>{feature}</span>
//                 </div>
//               ))}
//             </div>
//             <button onClick={handleOrder}>Continue</button>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Gig;




import React from "react";
import "./Gig.scss";
import { Slider } from "infinite-react-carousel/lib";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";

function Gig() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleOrder = async () => {
    try {
      const res = await newRequest.post(`/orders/create/${id}`);
      navigate(`/submit-requirements/${res.data.id}`);
    } catch (err) {
      console.error("Failed to create order:", err);
    }
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["gig", id],
    queryFn: () =>
      newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  const userId = data?.userId;

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId, // only runs if userId is truthy
  });

  return (
    <div className="gig">
      {isLoading ? (
        "loading"
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container">
          <div className="left">
            <span className="breadcrumbs">
              GigOrbit {">"} Graphics & Design {">"}
            </span>
            <h1>{data.title}</h1>

            {/* Seller Profile */}
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="user">
                <img
                  className="pp"
                  src={dataUser.img || "/img/noavatar.jpg"}
                  alt=""
                />
                <span>{dataUser.username}</span>
                {!isNaN(data.totalStars / data.starNumber) && (
                  <div className="stars">
                    {Array(Math.round(data.totalStars / data.starNumber))
                      .fill()
                      .map((_, i) => (
                        <img src="/img/star.png" alt="" key={i} />
                      ))}
                    <span>{Math.round(data.totalStars / data.starNumber)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Image Slider */}
            {Array.isArray(data?.images) && data.images.length > 0 ? (
              <Slider slidesToShow={1} arrowsScroll={1} className="slider">
                {data.images.map((img) => (
                  <img key={img} src={img} alt="" />
                ))}
              </Slider>
            ) : (
              <p>No images available</p>
            )}

            <h2>About This Gig</h2>
            <p>{data.desc}</p>

            {/* Seller Section */}
            {!isLoadingUser && !errorUser && dataUser && (
              <div className="seller">
                <h2>About The Seller</h2>
                <div className="user">
                  <img src={dataUser.img || "/img/noavatar.jpg"} alt="" />
                  <div className="info">
                    <span>{dataUser.username}</span>
                    {!isNaN(data.totalStars / data.starNumber) && (
                      <div className="stars">
                        {Array(Math.round(data.totalStars / data.starNumber))
                          .fill()
                          .map((_, i) => (
                            <img src="/img/star.png" alt="" key={i} />
                          ))}
                        <span>
                          {Math.round(data.totalStars / data.starNumber)}
                        </span>
                      </div>
                    )}
                    <button>Contact Me</button>
                  </div>
                </div>
                <div className="box">
                  <div className="items">
                    <div className="item">
                      <span className="title">From</span>
                      <span className="desc">{dataUser.country}</span>
                    </div>
                    <div className="item">
                      <span className="title">Member since</span>
                      <span className="desc">Aug 2022</span>
                    </div>
                    <div className="item">
                      <span className="title">Avg. response time</span>
                      <span className="desc">4 hours</span>
                    </div>
                    <div className="item">
                      <span className="title">Last delivery</span>
                      <span className="desc">1 day</span>
                    </div>
                    <div className="item">
                      <span className="title">Languages</span>
                      <span className="desc">English</span>
                    </div>
                  </div>
                  <hr />
                  <p>{dataUser.desc}</p>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <Reviews gigId={id} />
          </div>

          {/* Right Sidebar */}
          <div className="right">
            <div className="price">
              <h3>{data.shortTitle}</h3>
              <h2>$ {data.price}</h2>
            </div>
            <p>{data.shortDesc}</p>
            <div className="details">
              <div className="item">
                <img src="/img/clock.png" alt="" />
                <span>{data.deliveryDate} Days Delivery</span>
              </div>
              <div className="item">
                <img src="/img/recycle.png" alt="" />
                <span>{data.revisionNumber} Revisions</span>
              </div>
            </div>
            <div className="features">
              {data.features.map((feature) => (
                <div className="item" key={feature}>
                  <img src="/img/greencheck.png" alt="" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <button onClick={handleOrder}>Continue</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gig;
