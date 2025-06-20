'use client';

import { useEffect } from "react";
import { FiArrowRight, FiPieChart, FiTrendingUp, FiShield, FiBarChart2 } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const features = [
    {
      icon: <FiPieChart className="w-8 h-8 text-blue-500" />,
      title: "Quản lý Tài Sản Toàn Diện",
      description: "Theo dõi và quản lý danh mục đầu tư, tài sản và nợ của bạn trong một nền tảng duy nhất",
    },
    {
      icon: <FiTrendingUp className="w-8 h-8 text-blue-500" />,
      title: "Phân Tích Tài Chính",
      description: "Nhận phân tích chuyên sâu về sức khỏe tài chính và xu hướng tăng trưởng tài sản",
    },
    {
      icon: <FiShield className="w-8 h-8 text-blue-500" />,
      title: "Bảo Mật Tối Ưu",
      description: "Bảo vệ thông tin tài chính của bạn với hệ thống bảo mật tiêu chuẩn ngân hàng",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full px-4 mb-16 md:w-1/2 md:mb-0" data-aos="fade-right">
              <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                Quản Lý Tài Sản Thông Minh
              </h1>
              <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
                Nền tảng quản lý tài sản số hiện đại giúp bạn theo dõi, phân tích và tối ưu hóa danh mục đầu tư của mình một cách hiệu quả.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/register"
                  className="inline-flex items-center px-6 py-3 text-lg font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Bắt Đầu Ngay
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link 
                  href="/risk-assessment"
                  className="inline-flex items-center px-6 py-3 text-lg font-medium text-blue-600 transition-colors bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border border-blue-600"
                >
                  <FiBarChart2 className="mr-2" />
                  Trắc Nghiệm Khẩu Vị Đầu Tư
                </Link>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2" data-aos="fade-left">
              <Image
                src="https://images.unsplash.com/photo-1531973576160-7125cd663d86"
                alt="Hero"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Tại Sao Chọn Chúng Tôi?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Khám phá các tính năng giúp bạn quản lý tài sản hiệu quả hơn.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 transition-transform bg-white rounded-lg shadow-lg dark:bg-gray-700 hover:transform hover:scale-105"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Bắt Đầu Quản Lý Tài Sản
            </h2>
            <p className="mb-8 text-gray-600 dark:text-gray-300">
              Tạo tài khoản miễn phí và bắt đầu hành trình quản lý tài sản thông minh của bạn.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/register"
                className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Đăng Ký Ngay
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Đăng Nhập
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-8 md:mb-0">
              <Image
                src="/file.svg"
                alt="Digital Wealth Logo"
                width={128}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTwitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaLinkedin className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaGithub className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>© 2024 Digital Wealth. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}