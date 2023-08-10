import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { axiosInstance } from "./axios";

export default function PrivateRoutes() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance
        .get("/api/dashboard")
        .then((response) => {
          setAuthorized(true);
        })
        .catch((error) => {
          console.log(error);
          setAuthorized(false);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchData();
  }, []);

  return loading ? <div>Loading...</div> : authorized ? <Outlet /> : <Navigate to="/login" replace={true} />;
}
