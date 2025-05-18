'use client';

import { useState } from "react";
import { BsFillGridFill, BsQuestionCircle, BsPieChart, BsBoxes, BsGear, BsPerson } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";

// Đăng ký các component của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, logout } = useAuth();
  const router = useRouter();

  const pieData = {
    labels: ["Cổ phiếu", "Trái phiếu", "Bất động sản", "Tiền mặt"],
    datasets: [{
      data: [40, 30, 20, 10],
      backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]
    }]
  };

  const barData = {
    labels: ["Thận trọng", "Cân bằng", "Tăng trưởng"],
    datasets: [{
      label: "Phân bố Hồ sơ Rủi ro",
      data: [30, 45, 25],
      backgroundColor: "#3B82F6"
    }]
  };

  const metrics = [
    { title: "Tổng số đánh giá", value: "1,234", change: "+12%" },
    { title: "Hồ sơ đang hoạt động", value: "856", change: "+5%" },
    { title: "Lớp tài sản", value: "24", change: "+2%" },
    { title: "Thời gian phản hồi TB", value: "2.3s", change: "-8%" }
  ];

  // Xử lý chuyển hướng khi tab thay đổi
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    if (tabId !== 'dashboard') {
      router.push(`/admin/${tabId}`);
    }
  };

  return (
    <div className="overflow-auto h-[calc(100vh-4rem)]">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Chào mừng trở lại, {user?.name || 'Admin'}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">{metric.title}</h3>
            <div className="flex items-baseline mt-2">
              <p className="text-2xl font-semibold text-gray-800">{metric.value}</p>
              <span className={`ml-2 text-sm ${metric.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>{metric.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Phân bổ tài sản</h2>
          <div className="h-64">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Phân bố mức độ rủi ro</h2>
          <div className="h-64">
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
} 