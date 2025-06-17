'use client';

import { useState } from "react";
import { BsFillGridFill, BsQuestionCircle, BsPieChart, BsBoxes, BsGear, BsPerson } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, logout } = useAuth();
  const router = useRouter();

  const pieData = [
    { name: 'Cổ phiếu', value: 40, color: '#3B82F6' },
    { name: 'Trái phiếu', value: 30, color: '#10B981' },
    { name: 'Bất động sản', value: 20, color: '#F59E0B' },
    { name: 'Tiền mặt', value: 10, color: '#EF4444' }
  ];

  const barData = [
    { name: 'Thận trọng', value: 30 },
    { name: 'Cân bằng', value: 45 },
    { name: 'Tăng trưởng', value: 25 }
  ];

  const metrics = [
    { title: "Tổng số đánh giá", value: "1,234", change: "+12%" },
    { title: "Hồ sơ đang hoạt động", value: "856", change: "+5%" },
    { title: "Lớp tài sản", value: "24", change: "+2%" },
    { title: "Thời gian phản hồi TB", value: "2.3s", change: "-8%" }
  ];

  // Custom tooltip cho Pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p>{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip cho Bar chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`${label}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

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
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Phân bố mức độ rủi ro</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                />
                <YAxis 
                  fontSize={12}
                  label={{ value: '%', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar 
                  dataKey="value" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 