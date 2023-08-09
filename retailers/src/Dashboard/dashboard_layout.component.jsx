import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";

export default function DashboardLayout() {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    document.title = "Dashboard";
    const fetchData = async () => {};

    fetchData();
  }, []);

  return !authorized ? <div>User is not authorized</div> : <>Flipkart</>;
}
