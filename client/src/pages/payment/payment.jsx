import React, { useEffect, useState } from "react";
import "./payment.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import Checkout from "../../components/checkForm/checkForm";
const stripePromise = loadStripe(
  "pk_test_51R7ssxGKtnTH8UDbeJZRDvoBPU0hGtz0dIT4sZMjQp1fMiwvV5DqP5AhdCnNvuaSgNIFNH5L3VefoL57kxBoPows00UkdD5peA"
);

const Payment = () => {
  const [clientSecret, setClientSecret] = useState("");

  const { id } = useParams();
  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await newRequest.post(
          `/modules/pay/${id}`
        );
        
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.log(err);
      }
    };
    makeRequest();
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return <div className="pay">
    {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <Checkout />
        </Elements>
      )}
  </div>;
};

export default Payment;