/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Thêm cấu hình này nếu bạn muốn vô hiệu hóa tạm thời các cảnh báo eslint khi build
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
