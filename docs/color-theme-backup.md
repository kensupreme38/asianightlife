# Color Theme Backup - Màu cũ và màu mới

## Màu cũ (Purple/Pink/Blue Neon Theme) - Đã thay thế

### Primary Colors (Cũ)
```css
--primary: 269 100% 69%;  /* Electric Purple */
--primary-foreground: 0 0% 100%;  /* White */
```

### Accent Colors (Cũ)
```css
--accent: 326 100% 74%;  /* Neon Pink */
--accent-foreground: 0 0% 100%;  /* White */
```

### Ring Color (Cũ)
```css
--ring: 269 100% 69%;  /* Electric Purple */
```

### Custom Nightlife Theme Tokens (Cũ)

#### Light Mode & Dark Mode
```css
--neon-pink: 326 100% 74%;
--neon-blue: 214 100% 69%;
--electric-purple: 269 100% 69%;
--gold-accent: 45 100% 72%;
```

### Gradients (Cũ)

#### Light Mode
```css
--gradient-primary: linear-gradient(135deg, hsl(269 100% 69%), hsl(326 100% 74%));
--gradient-secondary: linear-gradient(135deg, hsl(214 100% 69%), hsl(269 100% 69%));
```

#### Dark Mode
```css
--gradient-primary: linear-gradient(135deg, hsl(269 100% 69%), hsl(326 100% 74%));
--gradient-secondary: linear-gradient(135deg, hsl(214 100% 69%), hsl(269 100% 69%));
```

### Shadows (Cũ)

#### Light Mode
```css
--shadow-neon: 0 0 30px hsl(269 100% 69% / 0.2);
--shadow-glow: 0 0 20px hsl(326 100% 74% / 0.2);
```

#### Dark Mode
```css
--shadow-neon: 0 0 30px hsl(269 100% 69% / 0.3);
--shadow-glow: 0 0 20px hsl(326 100% 74% / 0.4);
```

### Background Gradients (Cũ)

#### Light Mode Body
```css
background-image: 
  radial-gradient(circle at 20% 80%, hsl(269 100% 69% / 0.05) 0%, transparent 50%),
  radial-gradient(circle at 80% 20%, hsl(326 100% 74% / 0.05) 0%, transparent 50%);
```

#### Dark Mode Body
```css
background-image: 
  radial-gradient(circle at 20% 80%, hsl(269 100% 69% / 0.1) 0%, transparent 50%),
  radial-gradient(circle at 80% 20%, hsl(326 100% 74% / 0.1) 0%, transparent 50%);
```

### Scrollbar (Cũ)
```css
::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, hsl(269 100% 69%), hsl(326 100% 74%));
}
```

### Sidebar Colors (Cũ - Dark Mode)
```css
--sidebar-primary: 224.3 76.3% 48%;
--sidebar-ring: 217.2 91.2% 59.8%;
```

### Tailwind Config Colors (Cũ)
```typescript
neon: {
  pink: "hsl(var(--neon-pink))",      // 326 100% 74%
  blue: "hsl(var(--neon-blue))",       // 214 100% 69%
  purple: "hsl(var(--electric-purple))", // 269 100% 69%
},
gold: "hsl(var(--gold-accent))",       // 45 100% 72%
```

### Components sử dụng màu cũ

1. **splash-screen.tsx**
   - Gradient text: `from-neon-pink via-purple-500 to-neon-cyan`
   - Loading dots: `bg-neon-pink`, `bg-purple-500`, `bg-neon-cyan`
   - Border: `border-neon-pink/30`

2. **HeroBanner.tsx**
   - Star icon: `text-gold`
   - Text: `text-gold`
   - MapPin: `text-neon-pink`
   - Dots: `bg-neon-pink`

3. **SearchSection.tsx**
   - MapPin: `text-neon-pink`

4. **VisitUsMap.tsx**
   - Icons background: `from-neon-blue to-neon-pink`

5. **BookingGuide.tsx**
   - Step icons: `from-neon-blue to-neon-pink`

---

## Màu mới (Red Gradient Theme) - Hiện tại

### Primary Colors (Mới)
```css
--primary: 0 100% 60%;  /* Bright Red */
--primary-foreground: 0 0% 100%;  /* White */
```

### Accent Colors (Mới)
```css
--accent: 15 100% 65%;  /* Red Orange */
--accent-foreground: 0 0% 100%;  /* White */
```

### Ring Color (Mới)
```css
--ring: 0 100% 60%;  /* Bright Red */
```

### Custom Red Gradient Theme Tokens (Mới)

#### Light Mode & Dark Mode
```css
--red-bright: 0 100% 60%;   /* Bright Red */
--red-deep: 0 100% 45%;      /* Deep Red */
--red-orange: 15 100% 65%;   /* Red Orange */
--red-pink: 350 100% 70%;    /* Red Pink */
```

### Gradients (Mới)

#### Light Mode
```css
--gradient-primary: linear-gradient(135deg, hsl(0 100% 45%), hsl(15 100% 65%));
--gradient-secondary: linear-gradient(135deg, hsl(0 100% 60%), hsl(350 100% 70%));
```

#### Dark Mode
```css
--gradient-primary: linear-gradient(135deg, hsl(0 100% 45%), hsl(15 100% 65%));
--gradient-secondary: linear-gradient(135deg, hsl(0 100% 60%), hsl(350 100% 70%));
```

### Shadows (Mới)

#### Light Mode
```css
--shadow-neon: 0 0 30px hsl(0 100% 60% / 0.2);
--shadow-glow: 0 0 20px hsl(15 100% 65% / 0.2);
```

#### Dark Mode
```css
--shadow-neon: 0 0 30px hsl(0 100% 60% / 0.3);
--shadow-glow: 0 0 20px hsl(15 100% 65% / 0.4);
```

### Background Gradients (Mới)

#### Light Mode Body
```css
background-image: 
  radial-gradient(circle at 20% 80%, hsl(0 100% 45% / 0.05) 0%, transparent 50%),
  radial-gradient(circle at 80% 20%, hsl(15 100% 65% / 0.05) 0%, transparent 50%);
```

#### Dark Mode Body
```css
background-image: 
  radial-gradient(circle at 20% 80%, hsl(0 100% 45% / 0.1) 0%, transparent 50%),
  radial-gradient(circle at 80% 20%, hsl(15 100% 65% / 0.1) 0%, transparent 50%);
```

### Scrollbar (Mới)
```css
::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, hsl(0 100% 45%), hsl(15 100% 65%));
}
```

### Sidebar Colors (Mới - Dark Mode)
```css
--sidebar-primary: 0 100% 60%;
--sidebar-ring: 0 100% 60%;
```

### Tailwind Config Colors (Mới)
```typescript
red: {
  bright: "hsl(var(--red-bright))",   // 0 100% 60%
  deep: "hsl(var(--red-deep))",        // 0 100% 45%
  orange: "hsl(var(--red-orange))",     // 15 100% 65%
  pink: "hsl(var(--red-pink))",         // 350 100% 70%
}
```

### Components đã cập nhật sang màu mới

1. **splash-screen.tsx**
   - Gradient text: `from-red-deep via-red-bright to-red-orange`
   - Loading dots: `bg-red-deep`, `bg-red-bright`, `bg-red-orange`
   - Border: `border-red-bright/30`

2. **HeroBanner.tsx**
   - Star icon: `text-red-orange`
   - Text: `text-red-orange`
   - MapPin: `text-red-bright`
   - Dots: `bg-red-bright`

3. **SearchSection.tsx**
   - MapPin: `text-red-bright`

4. **VisitUsMap.tsx**
   - Icons background: `from-red-deep to-red-orange`

5. **BookingGuide.tsx**
   - Step icons: `from-red-deep to-red-orange`

---

## Cách khôi phục lại màu cũ

### Bước 1: Cập nhật `src/app/globals.css`

Thay thế các giá trị trong `:root`:
```css
--primary: 0 100% 60%;  /* Đổi về: 269 100% 69% */
--accent: 15 100% 65%;   /* Đổi về: 326 100% 74% */
--ring: 0 100% 60%;      /* Đổi về: 269 100% 69% */
```

Thay thế các token màu:
```css
/* Xóa các token red */
--red-bright: 0 100% 60%;
--red-deep: 0 100% 45%;
--red-orange: 15 100% 65%;
--red-pink: 350 100% 70%;

/* Thêm lại các token neon */
--neon-pink: 326 100% 74%;
--neon-blue: 214 100% 69%;
--electric-purple: 269 100% 69%;
--gold-accent: 45 100% 72%;
```

Thay thế gradients:
```css
/* Đổi về gradient cũ */
--gradient-primary: linear-gradient(135deg, hsl(var(--electric-purple)), hsl(var(--neon-pink)));
--gradient-secondary: linear-gradient(135deg, hsl(var(--neon-blue)), hsl(var(--electric-purple)));
```

Thay thế shadows:
```css
--shadow-neon: 0 0 30px hsl(var(--electric-purple) / 0.2);
--shadow-glow: 0 0 20px hsl(var(--neon-pink) / 0.2);
```

Thay thế background gradients:
```css
background-image: 
  radial-gradient(circle at 20% 80%, hsl(var(--electric-purple) / 0.05) 0%, transparent 50%),
  radial-gradient(circle at 80% 20%, hsl(var(--neon-pink) / 0.05) 0%, transparent 50%);
```

Thay thế scrollbar:
```css
::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, hsl(var(--electric-purple)), hsl(var(--neon-pink)));
}
```

Cập nhật sidebar (dark mode):
```css
--sidebar-primary: 224.3 76.3% 48%;
--sidebar-ring: 217.2 91.2% 59.8%;
```

### Bước 2: Cập nhật `tailwind.config.ts`

Thay thế:
```typescript
// Xóa red object
red: {
  bright: "hsl(var(--red-bright))",
  deep: "hsl(var(--red-deep))",
  orange: "hsl(var(--red-orange))",
  pink: "hsl(var(--red-pink))",
}

// Thêm lại neon object
neon: {
  pink: "hsl(var(--neon-pink))",
  blue: "hsl(var(--neon-blue))",
  purple: "hsl(var(--electric-purple))",
},
gold: "hsl(var(--gold-accent))",
```

### Bước 3: Cập nhật các Components

1. **splash-screen.tsx**
   - `from-red-deep via-red-bright to-red-orange` → `from-neon-pink via-purple-500 to-neon-cyan`
   - `bg-red-deep`, `bg-red-bright`, `bg-red-orange` → `bg-neon-pink`, `bg-purple-500`, `bg-neon-cyan`
   - `border-red-bright/30` → `border-neon-pink/30`

2. **HeroBanner.tsx**
   - `text-red-orange` → `text-gold`
   - `text-red-bright` → `text-neon-pink`
   - `bg-red-bright` → `bg-neon-pink`

3. **SearchSection.tsx**
   - `text-red-bright` → `text-neon-pink`

4. **VisitUsMap.tsx**
   - `from-red-deep to-red-orange` → `from-neon-blue to-neon-pink`

5. **BookingGuide.tsx**
   - `from-red-deep to-red-orange` → `from-neon-blue to-neon-pink`

---

## Tóm tắt thay đổi

| Thuộc tính | Màu cũ | Màu mới |
|------------|--------|---------|
| Primary | Electric Purple (269 100% 69%) | Bright Red (0 100% 60%) |
| Accent | Neon Pink (326 100% 74%) | Red Orange (15 100% 65%) |
| Ring | Electric Purple (269 100% 69%) | Bright Red (0 100% 60%) |
| Gradient Primary | Purple → Pink | Deep Red → Red Orange |
| Gradient Secondary | Blue → Purple | Bright Red → Red Pink |
| Theme Name | Purple/Pink/Blue Neon | Red Gradient |

---

**Lưu ý:** File này được tạo vào ngày chuyển đổi màu từ Purple/Pink/Blue Neon Theme sang Red Gradient Theme. Tất cả thông tin màu cũ đã được lưu lại để có thể khôi phục nếu cần