import React, { useEffect, useState } from "react";
import SellProducts from "./SellProducts/SellProducts";

export default function DashboardLayout() {
  useEffect(() => {
    document.title = "Retailers Dashboard";
  }, []);

  return (
    <>
      <SellProducts />
    </>
  );
}
