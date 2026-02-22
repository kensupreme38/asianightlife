# 🎉 KTV Nightlife Venue Directory

Một ứng dụng web hiện đại để tìm kiếm và khám phá các địa điểm giải trí về đêm, karaoke và venue.

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel

## ✨ Features

- 🎯 Tìm kiếm venue theo địa điểm
- 🖼️ Gallery ảnh với Masonry layout
- 📱 Responsive design
- 🌙 Dark/Light mode support
- 🔍 Advanced filtering
- 📍 Location-based search

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## 🌐 Live Demo

Deploy link sẽ được cập nhật sau khi deploy lên Vercel.

## 📚 Documentation

Bộ tài liệu kỹ thuật chi tiết đã được tạo trong thư mục `/docs`:

- **[Technical Documentation](./docs/TECHNICAL_DOCUMENTATION.md)** - Comprehensive technical documentation
- **[API Documentation](./docs/API_DOCUMENTATION.md)** - Complete API reference
- **[Quick Start Guide](./docs/QUICK_START_GUIDE.md)** - Quick guide to get started
- **[Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)** - Detailed deployment guide
- **[Account Handover](./docs/ACCOUNT_HANDOVER.md)** - Account credentials handover (⚠️ Confidential)
- **[Documentation Index](./docs/README.md)** - Documentation index

Xem [docs/README.md](./docs/README.md) để biết thêm chi tiết.

## 📝 License

Private project - All rights reserved.
Đã thêm animations:
1. VenueCard
Thêm MotionHover với scale và lift effect khi hover
Cards sẽ nâng nhẹ và phóng to khi hover
2. VenueGrid
Thay ScrollReveal cũ bằng MotionScrollReveal (Framer Motion)
Thêm MotionStagger để cards xuất hiện tuần tự
Header và pagination có scroll animations
3. DJCard
Thêm MotionHover tương tự VenueCard
Hover effect mượt hơn
4. DJGrid
Thay ScrollReveal bằng MotionScrollReveal
Thêm MotionStagger cho danh sách DJs
Tất cả animations được tối ưu với Framer Motion
5. HeroBanner
Thêm slide transitions với AnimatePresence
Content fade in với stagger animations
Dots indicator có hover và tap animations
Transitions mượt hơn giữa các slides
Kết quả:
Smooth scroll animations với Lenis
Framer Motion animations trên toàn dự án
Hover effects trên cards
Stagger animations cho grids
Page transitions mượt mà
Hero banner với slide animations