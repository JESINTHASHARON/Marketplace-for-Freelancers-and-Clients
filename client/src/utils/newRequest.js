import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://localhost:2005/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default newRequest;
