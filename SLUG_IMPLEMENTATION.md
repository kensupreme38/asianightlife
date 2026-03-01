# Slug Implementation Guide

## Tổng quan

Đã thành công thêm tính năng slug cho venue URLs, giúp SEO tốt hơn với URL thân thiện:
- Trước: `/venue/1` hoặc `/en/venue/1`
- Sau: `/venue/iconic-ktv` hoặc `/en/venue/supreme-ktv`

## Những thay đổi đã thực hiện

### 1. Helper Functions (`src/lib/slug-utils.ts`)
Tạo 2 functions:
- `generateSlug(name)`: Tạo slug từ tên venue (KHÔNG có ID)
- `findVenueIdBySlug(slug, venues)`: Tìm venue ID từ slug hoặc ID number

### 2. Venue Interface (`src/hooks/use-venues.ts`)
- Thêm trường `slug: string` vào interface Venue
- Auto-generate slug khi map data

### 3. Routing Changes
Đổi tên folder từ `[id]` sang `[slug]`:
- `src/app/[locale]/venue/[slug]/page.tsx`
- `src/app/venue/[slug]/page.tsx`

### 4. Component Updates
Cập nhật các components để sử dụng slug:
- `VenueCard.tsx`: Link từ `/venue/${venue.id}` → `/venue/${venue.slug}`
- `VenueDetailClient.tsx`: Breadcrumb sử dụng slug
- `RelatedVenues.tsx`: Generate slug cho related venues

### 5. API Routes
- `src/app/api/venues/[slug]/route.ts`: Hỗ trợ tìm venue bằng slug hoặc ID
- `src/app/api/venues/route.ts`: Thêm slug vào response

## Backward Compatibility

Hệ thống vẫn hỗ trợ old URLs với ID:
- `/venue/1` vẫn hoạt động
- `/en/venue/1` vẫn hoạt động

Logic: `findVenueIdBySlug()` sẽ:
1. Thử match slug với tên venue
2. Nếu không match, kiểm tra xem có phải là số (ID) không
3. Trả về venue ID nếu tìm thấy

## Ví dụ Slug Format

```
Iconic KTV → iconic-ktv
Supreme KTV → supreme-ktv
Club Galaxy → club-galaxy
Karaoke BOSS KTV - 27 - 29 - 31 Duong 9A → karaoke-boss-ktv-27-29-31-duong-9a
Matrix Karaoke KTV - Trung Son → matrix-karaoke-ktv-trung-son
1127 KTV → 1127-ktv
```

## Xử lý Duplicate Names

Nếu có 2 venues cùng tên (rất hiếm):
- Slug sẽ giống nhau
- `findVenueIdBySlug()` sẽ trả về venue đầu tiên tìm thấy
- Có thể thêm logic để append số thứ tự nếu cần

## Testing

Để test:
1. Truy cập trang chủ
2. Click vào bất kỳ venue card nào
3. Kiểm tra URL trong browser - phải có dạng slug KHÔNG có số ID
4. Test backward compatibility bằng cách truy cập `/venue/1` trực tiếp

## Lưu ý quan trọng

⚠️ **File data.ts chưa được cập nhật**

File `src/lib/data.ts` có hơn 10,000 dòng và chứa ~100+ venues. Hiện tại:
- Slug được **auto-generate** từ tên venue
- Không cần thêm trường `slug` vào data.ts
- Nếu muốn custom slug cho từng venue, có thể thêm sau

## Next Steps (Optional)

Nếu muốn thêm custom slug vào data.ts:

```typescript
{
  id: 1,
  slug: "iconic-ktv-singapore", // Custom slug
  name: "Iconic KTV",
  // ... rest of data
}
```

Hệ thống sẽ ưu tiên dùng custom slug nếu có, nếu không sẽ auto-generate.

## SEO Benefits

✅ URL thân thiện với người dùng
✅ Chứa keywords (tên venue)
✅ Dễ share và nhớ
✅ Tốt hơn cho search engines
✅ Vẫn giữ backward compatibility
✅ KHÔNG có số ID trong URL (clean URLs)

## Performance

- Slug generation rất nhanh (string operations)
- Lookup by slug: O(n) linear search (acceptable với ~100 venues)
- Cache vẫn hoạt động bình thường (revalidate: 3600s)

## So sánh URL

### Trước:
```
/venue/1
/en/venue/2
/vi/venue/79
```

### Sau:
```
/venue/iconic-ktv
/en/venue/supreme-ktv
/vi/venue/karaoke-boss-ktv-27-29-31-duong-9a
```

Rõ ràng, dễ đọc, và SEO-friendly hơn nhiều!
