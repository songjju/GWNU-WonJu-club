import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

// Chart.js의 모든 구성 요소를 등록
Chart.register(...registerables);

const ClubAnalytics = ({ data, title }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (data.length === 0) return;

    const ctx = chartRef.current.getContext("2d");
    const labels = data.map((item) => item.type || item.category);
    const counts = data.map((item) => item.count);
    const backgroundColors = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 205, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(201, 203, 207, 0.2)",
    ];
    const borderColors = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 205, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(201, 203, 207, 1)",
    ];

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: counts,
            backgroundColor: backgroundColors.slice(0, labels.length),
            borderColor: borderColors.slice(0, labels.length),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 18,
              weight: "bold",
            },
            color: "#333",
          },
          legend: {
            display: true,
            position: "top",
            labels: {
              font: {
                size: 14,
              },
              color: "#333",
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            titleFont: {
              size: 16,
              weight: "bold",
            },
            bodyFont: {
              size: 14,
            },
            footerFont: {
              size: 12,
            },
            padding: 10,
          },
        },
      },
    });
  }, [data, title]);

  return (
    <div style={{ position: "relative", width: "280px", height: "400px" }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default ClubAnalytics;
