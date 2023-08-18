import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./styles.css";
import { TaskContractAddress } from "../../config.js";
import TaskAbi from "../../TaskContract.json";
import { ethers } from "ethers";
import { axiosInstance } from "../../axios";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useNavigate } from "react-router-dom";

export default function SpinWheel() {
  const [chart, setChart] = useState(null);
  const [spinDisabled, setSpinDisabled] = useState(false);
  const [finalValue, setFinalValue] = useState(0);
  const [popOut, setPopOut] = useState(false);
  const [boughtPopOut, setBoughtPopOut] = useState(false);
  const navigate = useNavigate();

  const getLoyaltyCoins = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const response = await axiosInstance.post(`/api/customer/spin_wheel/credit`, {
        amount: finalValue,
      });
      const { customerWalletId, newCustomerIpfsCid } = response.data;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const TaskContract = new ethers.Contract(TaskContractAddress, TaskAbi.abi, signer);
      await TaskContract.setCid(customerWalletId, newCustomerIpfsCid);
      setBoughtPopOut(true);
    } catch (err) {
      console.error(err);
    }
  };

  const rotationValues = [
    // { minDegree: 0, maxDegree: 30, value: "38282" },
    { minDegree: 0, maxDegree: 60, value: "10 coins", amount: 10 },
    { minDegree: 61, maxDegree: 120, value: "2 coins", amount: 2 },
    { minDegree: 121, maxDegree: 180, value: "20 coins", amount: 20 },
    { minDegree: 181, maxDegree: 240, value: "1 coin", amount: 1 },
    { minDegree: 241, maxDegree: 300, value: "Free shipping", amount: 0 },
    { minDegree: 301, maxDegree: 360, value: "5 coins", amount: 5 },
  ];

  const data = [16, 16, 16, 16, 16, 16];
  const pieColors = ["#4166F5", "#b2d8f5", "#4166F5", "#b2d8f5", "#4166F5", "#b2d8f5"];

  useEffect(() => {
    const wheel = document.getElementById("wheel");

    const newChart = new Chart(wheel, {
      plugins: [ChartDataLabels],
      type: "pie",
      data: {
        labels: ["10 coins", "5 coins", "Free ship", "1 coin", "20 coins", "2 coins"],
        datasets: [
          {
            backgroundColor: pieColors,
            data: data,
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 0 },
        plugins: {
          tooltip: false,
          legend: {
            display: false,
          },
          datalabels: {
            color: "#ffffff",
            formatter: (_, context) => context.chart.data.labels[context.dataIndex],
            font: { size: 24 },
          },
        },
      },
    });

    setChart(newChart);

    return () => {
      newChart.destroy();
    };
  }, []);

  const valueGenerator = (angleValue) => {
    for (let i of rotationValues) {
      if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
        setFinalValue(i.amount);
        setSpinDisabled(false);
        setPopOut(true);
        break;
      }
    }
  };

  let count = 0;
  let resultValue = 101;

  const startSpinning = () => {
    setSpinDisabled(true);
    setFinalValue(0);

    let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
    let rotationInterval = window.setInterval(() => {
      chart.options.rotation = chart.options.rotation + resultValue;
      chart.update();

      if (chart.options.rotation >= 360) {
        count += 1;
        resultValue -= 5;
        chart.options.rotation = 0;
      } else if (count > 15 && chart.options.rotation === randomDegree) {
        valueGenerator(randomDegree);
        clearInterval(rotationInterval);
        count = 0;
        resultValue = 101;
      }
    }, 10);
  };

  return (
    <div className="spin-wheel">
      <div className="wrapper">
        <canvas id="wheel"></canvas>
        <button id="spin-btn" onClick={startSpinning} disabled={spinDisabled}>
          Spin
        </button>
        <div className="reward-arrow"></div>
      </div>
      {popOut && (
        <div className="bought-pop-out">
          <div className="container">
            <div className="wrapper">
              <div>You won {finalValue} Loyalty Coins!</div>
              <div className="loyalty-wrapper">
                <div className="btn-wrapper">
                  <div
                    className="get-loyalty"
                    onClick={async () => {
                      await getLoyaltyCoins();
                    }}
                  >
                    Get {finalValue}
                  </div>
                  <div
                    className="not-now"
                    onClick={() => {
                      setPopOut(false);
                    }}
                  >
                    <div>Not now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {boughtPopOut && (
        <div className="bought-pop-out">
          <div className="container">
            <div className="wrapper">
              <div>
                <VerifiedIcon style={{ color: "green", fontSize: "40px" }} />
                <h1>
                  Credited{" "}
                  <img
                    src="https://rukminim2.flixcart.com/lockin/32/32/images/super_coin_icon_22X22.png?q=90"
                    style={{ width: "25px" }}
                  />{" "}
                  {finalValue + " "}
                </h1>
              </div>
              <div className="loyalty-wrapper">
                <div className="btn-wrapper">
                  <div
                    className="get-loyalty"
                    onClick={() => {
                      setBoughtPopOut(false);
                      navigate("/rewards_hub");
                    }}
                  >
                    Rewards Hub
                  </div>
                  <div
                    className="not-now"
                    onClick={() => {
                      setBoughtPopOut(false);
                      navigate("/");
                    }}
                  >
                    <div>Shop Other Products</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
