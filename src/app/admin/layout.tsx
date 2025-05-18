'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth.context';
import { useLayout } from '@/contexts/layout.context';
import { BsFillGridFill, BsQuestionCircle, BsPieChart, BsBoxes, BsGear, BsPerson, BsListCheck } from "react-icons/bs";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { isAdmin, logout, isAuthenticated, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const context = useAuth();
  const { setShowHeader } = useLayout();

  console.log("Initial render:", {user});

  // Handle responsive sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Set initial state based on screen size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ẩn header khi vào trang admin và hiện lại khi rời khỏi
  useEffect(() => {
    setShowHeader(false);
    return () => setShowHeader(true);
  }, [setShowHeader]);

  useEffect(() => {
    console.log("Running effect with user:", user);  
  }, [user]);

  useEffect(() => {
    if (!context.isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      
      if (!isAdmin()) {
        console.log("Not admin, redirecting");
        router.push('/');
        return;
      }
    }
  }, [isAuthenticated, user, context.isLoading]);

  // Xác định tab active dựa vào URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setActiveTab('dashboard');
    } else if (path.includes('/admin/questions')) {
      setActiveTab('questions');
    } else if (path.includes('/admin/question-categories')) {
      setActiveTab('question-categories');
    } else if (path.includes('/admin/profiles')) {
      setActiveTab('profiles');
    } else if (path.includes('/admin/assets')) {
      setActiveTab('assets');
    } else if (path.includes('/admin/allocations')) {
      setActiveTab('allocations');
    } else if (path.includes('/admin/settings')) {
      setActiveTab('settings');
    }
  }, []);

  if (context.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const MENU_ITEMS = [
    { icon: <BsFillGridFill className="text-xl" />, label: "Dashboard", id: "dashboard", path: "/admin" },
    { icon: <BsQuestionCircle className="text-xl" />, label: "Risk Questions", id: "questions", path: "/admin/questions" },
    { icon: <BsListCheck className="text-xl" />, label: "Question Categories", id: "question-categories", path: "/admin/question-categories" },
    { icon: <BsPerson className="text-xl" />, label: "Risk Profiles", id: "profiles", path: "/admin/profiles" },
    { icon: <BsBoxes className="text-xl" />, label: "Asset Classes", id: "assets", path: "/admin/assets" },
    { icon: <BsPieChart className="text-xl" />, label: "Allocations", id: "allocations", path: "/admin/allocations" },
    { icon: <BsGear className="text-xl" />, label: "Settings", id: "settings", path: "/admin/settings" }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}
      
      {/* Sidebar for mobile (overlay mode) */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden w-64 bg-white shadow-lg z-30 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Digital Wealth Admin</h1>
          <button onClick={toggleMobileSidebar} className="text-gray-600">
            <FiX className="text-xl" />
          </button>
        </div>
        <nav className="mt-4">
          {MENU_ITEMS.map((item) => (
            <Link
              href={item.path}
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileSidebarOpen(false); // Close mobile sidebar on navigation
              }}
              className={`flex items-center p-4 cursor-pointer transition-colors ${
                activeTab === item.id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Sidebar for desktop */}
      <div 
        className={`hidden md:block ${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300`}
      >
        <div className="p-4 border-b">
          <h1 className={`text-xl font-bold text-gray-800 ${!isSidebarOpen && "hidden"}`}>Risk Admin</h1>
          {!isSidebarOpen && (
            <div className="flex justify-center">
              <BsFillGridFill className="text-xl text-gray-800" />
            </div>
          )}
        </div>
        <nav className="mt-4">
          {MENU_ITEMS.map((item) => (
            <Link
              href={item.path}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center p-4 cursor-pointer transition-colors ${
                activeTab === item.id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
              } ${!isSidebarOpen && "justify-center"}`}
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileSidebar}
                className="text-gray-600 hover:text-gray-800 mr-4 md:hidden"
              >
                <FiMenu className="text-xl" />
              </button>
              
              {/* Desktop sidebar toggle */}
              <button
                onClick={toggleSidebar}
                className="text-gray-600 hover:text-gray-800 hidden md:block"
              >
                {isSidebarOpen ? <FiMenu className="text-xl" /> : <FiMenu className="text-xl" />}
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {user?.name?.[0] || 'A'}
                </div>
                <span className="ml-2 text-gray-700 hidden sm:inline-block">{user?.name || 'Admin'}</span>
              </div>
              <button 
                onClick={logout}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Logout"
              >
                <FiLogOut className="text-xl" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 