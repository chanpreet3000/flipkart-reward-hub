import React, { useEffect, useState } from "react";
import SellProducts from "./SellProducts/SellProducts";
import Deals from "./Deals/Deals";

export default function DashboardLayout() {
  useEffect(() => {
    document.title = "Retailers Dashboard";
  }, []);

  return (
    <div style={{ marginBottom: "3rem" }}>
      <SellProducts />
      <Deals />
    </div>
  );
}
