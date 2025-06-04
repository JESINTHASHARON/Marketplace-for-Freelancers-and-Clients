import "./app.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import React from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Gigs from "./pages/gigs/Gigs";
import Gig from "./pages/gig/Gig";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Add from "./pages/add/Add";
import Orders from "./pages/orders/Orders";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import MyGigs from "./pages/myGigs/MyGigs";
import SubmitRequirements from "./pages/SubmitRequirements/SubmitRequirements";
import UploadWork from "./pages/UploadWork/UploadWork";
import OrderDetails from "./pages/OrderDetails/OrderDetails";
import AddProject from "./pages/AddProject/AddProject";
import Download from "./pages/Download/download";
import MyProjects from "./components/MyProjects/MyProjects";
import Projects from "./pages/Projects/Projects";
import Project from "./pages/Project/Project";
import MyWorks from "./pages/MyWorks/MyWorks";
import Pay from "./pages/pay/Pay";
import Success from "./pages/success/Success";
import UserProfile from "./pages/UserProfile/UserProfile";
import Bids from "./pages/bids/bids";
import Modules from "./pages/modules/modules";
import AssignedModules from "./pages/AssignedModules/AssignedModules";
import Payment from "./pages/payment/payment";
import Success2 from "./pages/success2/success2";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <Outlet />
          <Footer />
        </QueryClientProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/gigs",
          element: <Gigs />,
        },
        {
          path: "/myGigs",
          element: <MyGigs />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/message/:id",
          element: <Message />,
        },
        {
          path: "/addProject",
          element: <AddProject/>,
        },
        {
          path: "/add",
          element: <Add />,
        },
        {
          path: "/gig/:id",
          element: <Gig />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/pay/:id",
          element: <Pay/>
        },
        {
          path: "/payment/:id",
          element: <Payment/>
        },
        {
          path: "/success",
          element: <Success />,
        },
        {
          path: "/success2",
          element: <Success2/>
        },
        {
          path: "/submit-requirements/:id",
          element: <SubmitRequirements />,
        },
        {
          path: "/upload-work/:id",
          element: <UploadWork />,
        },    
        {
          path: "/download/:id",
          element: <Download />,
        },
        {
          path: "/order/:id",
          element: <OrderDetails />,
        },
        {
          path: "/myprojects",
          element: <MyProjects/>
        },
        {
          path: "/projects",
          element: <Projects/>
        },
        {
          path: "/project/:id",
          element: <Project/>
        },
        {
          path: "/myworks",
          element: <MyWorks/>
        },
        {
          path: "/user/:id",
          element: <UserProfile/>
        },
        {
          path: "/project/:projectId/bids",
          element: <Bids/>
        },
        {
          path: "/projects/:projectId/assign/:freelancerId",
          element: <Modules/>
        },
        {
          path: "/assignedModule/:projectId",
          element: <AssignedModules/>,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;