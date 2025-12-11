# Framer Motion Integration

Framer Motion đã được tích hợp vào toàn dự án với các component và preset sẵn có.

## Cách sử dụng

### 1. Import components

```tsx
import { 
  MotionScrollReveal, 
  MotionPage, 
  MotionStagger,
  MotionHover,
  MotionButton 
} from '@/components/animations';
```

### 2. MotionScrollReveal - Scroll animations

Thay thế component ScrollReveal cũ với animation mượt mà hơn:

```tsx
import { MotionScrollReveal } from '@/components/animations';

<MotionScrollReveal 
  delay={0.2} 
  duration={0.6}
  triggerOnce={true}
>
  <div>Content sẽ fade in khi scroll vào viewport</div>
</MotionScrollReveal>
```

### 3. MotionPage - Page transitions

Wrap nội dung trang với animation:

```tsx
import { MotionPage } from '@/components/animations';

export default function MyPage() {
  return (
    <MotionPage>
      <h1>Page content</h1>
    </MotionPage>
  );
}
```

### 4. MotionStagger - Stagger animations

Tạo animation tuần tự cho danh sách:

```tsx
import { MotionStagger, MotionStaggerItem } from '@/components/animations';

<MotionStagger staggerDelay={0.1}>
  {items.map((item) => (
    <MotionStaggerItem key={item.id}>
      <ItemCard item={item} />
    </MotionStaggerItem>
  ))}
</MotionStagger>
```

### 5. MotionHover - Hover effects

Thêm hiệu ứng hover:

```tsx
import { MotionHover } from '@/components/animations';

<MotionHover scale={1.1} y={-5}>
  <Card>Hover me!</Card>
</MotionHover>
```

### 6. MotionButton - Button animations

Button với animation tự động:

```tsx
import { MotionButton } from '@/components/animations';

<MotionButton variant="scale" onClick={handleClick}>
  Click me
</MotionButton>
```

### 7. Custom animations với presets

Sử dụng các preset có sẵn:

```tsx
import { motion } from 'framer-motion';
import { fadeInUp, scaleIn, defaultTransition } from '@/components/animations';

<motion.div
  initial="hidden"
  animate="visible"
  variants={fadeInUp}
  transition={defaultTransition}
>
  Custom content
</motion.div>
```

## Animation Presets

- `fadeIn`, `fadeInUp`, `fadeInDown`, `fadeInLeft`, `fadeInRight`
- `scaleIn`, `scaleUp`
- `slideInUp`, `slideInDown`, `slideInLeft`, `slideInRight`
- `staggerContainer`, `staggerItem`
- `pageTransition`

## Transitions

- `defaultTransition` - Transition mặc định mượt mà
- `springTransition` - Spring animation
- `smoothTransition` - Transition mượt mà hơn

## Ví dụ nâng cao

### Kết hợp nhiều animation:

```tsx
import { motion } from 'framer-motion';
import { fadeInUp, springTransition } from '@/components/animations';

<motion.div
  initial="hidden"
  animate="visible"
  variants={fadeInUp}
  transition={springTransition}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Interactive content
</motion.div>
```

### Scroll-triggered với custom variants:

```tsx
import { motion, useScroll, useTransform } from 'framer-motion';

function ScrollParallax() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  return (
    <motion.div style={{ y }}>
      Parallax content
    </motion.div>
  );
}
```

## Lưu ý

- Tất cả components đã được tối ưu cho performance
- Sử dụng `triggerOnce={true}` cho scroll animations để tránh re-animate
- Framer Motion tự động tối ưu với `will-change` CSS
- Tương thích với Lenis smooth scroll đã được tích hợp

