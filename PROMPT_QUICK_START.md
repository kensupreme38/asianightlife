# 🚀 QUICK START: Tạo Admin Venue Upload

## PROMPT NGẮN GỌN ĐỂ BẮT ĐẦU

### Step 1: Setup Database & Storage (5 phút)

```
Hãy setup Supabase cho admin venue management:

1. Tạo table venues nếu chưa có (dùng schema từ VENUE_MIGRATION_PLAN.md)

2. Tạo Storage bucket:
   - Name: venue-images
   - Public: Yes
   - Policies: authenticated users upload, public read

3. Tạo helper functions trong src/lib/storage-utils.ts:
   - uploadVenueImage(file, venueId)
   - deleteVenueImage(url)
   - getPublicUrl(path)
```

---

### Step 2: Tạo Admin Routes (10 phút)

```
Tạo admin routes structure:

1. src/app/admin/layout.tsx
   - Sidebar với navigation
   - Header với user info
   - Protected route (check authentication)

2. src/app/admin/venues/page.tsx
   - List all venues trong table
   - Search và filter
   - Actions: Add New, Edit, Delete
   - Pagination

3. src/app/admin/venues/new/page.tsx
   - Form để tạo venue mới
   - Sử dụng VenueForm component

Sử dụng shadcn/ui components đã có trong project.
```

---

### Step 3: Tạo Venue Form (15 phút)

```
Tạo form component để create/edit venue:

File: src/app/admin/venues/components/VenueForm.tsx

Requirements:
1. Form fields:
   - name (required)
   - slug (auto-generate, editable)
   - country (select: Singapore, Vietnam, Thailand, Malaysia)
   - category (select: KTV, Club, Live House, Bar)
   - address, phone, price, hours
   - description (textarea với markdown)
   - main_image_url (image upload)
   - images (multiple upload, max 10)
   - status (select: active, draft, inactive)

2. Validation với Zod:
   - name: min 3, max 200 chars
   - slug: unique, lowercase, no spaces
   - country & category: required

3. Auto-generate slug từ name khi user typing

4. Submit actions:
   - Save as Draft
   - Publish (status = active)
   - Cancel

Sử dụng react-hook-form + zod + shadcn/ui form components.
```

---

### Step 4: Image Upload Component (10 phút)

```
Tạo image upload component:

File: src/app/admin/venues/components/ImageUpload.tsx

Features:
1. Single image upload (cho main_image_url)
   - Click hoặc drag & drop
   - Preview sau khi chọn
   - Upload to Supabase Storage bucket "venue-images"
   - Show progress
   - Delete/replace

2. Multiple images upload (cho images array)
   - Upload nhiều ảnh cùng lúc
   - Max 10 images
   - Preview grid
   - Drag to reorder
   - Delete individual image

3. Integration:
   - Upload to Supabase Storage
   - Return public URL
   - Handle errors

Sử dụng shadcn/ui Button, Input, Progress components.
```

---

### Step 5: API Routes (10 phút)

```
Tạo API routes cho admin operations:

1. POST /api/admin/venues
   - Create new venue
   - Validate data
   - Check slug uniqueness
   - Return created venue

2. PUT /api/admin/venues/[id]
   - Update existing venue
   - Validate data
   - Return updated venue

3. DELETE /api/admin/venues/[id]
   - Soft delete (set status = 'deleted')
   - Or hard delete
   - Delete images from storage

4. GET /api/admin/venues/check-slug?slug=xxx
   - Check if slug is available
   - Return { available: boolean }

Tất cả routes cần check authentication.
```

---

### Step 6: Bulk Import (Optional - 15 phút)

```
Tạo bulk import feature để migrate data từ data.ts:

File: src/app/admin/venues/components/BulkImport.tsx

Features:
1. Import từ CSV file
2. Import từ JSON file
3. One-click import từ existing data.ts
4. Show progress bar
5. Show success/error report

API: POST /api/admin/venues/bulk-import
- Accept array of venues
- Validate each item
- Batch insert (100 at a time)
- Return summary
```

---

## ✅ CHECKLIST HOÀN THÀNH

### Must Have (Core Features)
- [ ] Admin layout với sidebar
- [ ] Venue list page với table
- [ ] Create venue form
- [ ] Edit venue form
- [ ] Delete venue
- [ ] Image upload (single)
- [ ] Image upload (multiple)
- [ ] API routes (CRUD)
- [ ] Authentication check
- [ ] Slug auto-generation

### Nice to Have (Enhanced Features)
- [ ] Bulk import from CSV
- [ ] Bulk import from data.ts
- [ ] Image reordering (drag & drop)
- [ ] Markdown preview
- [ ] Search & filter
- [ ] Pagination
- [ ] Stats dashboard
- [ ] Export to CSV/JSON

### Advanced (Future)
- [ ] Image cropping/resizing
- [ ] Rich text editor
- [ ] Version history
- [ ] Audit log
- [ ] Role-based permissions

---

## 🎯 PROMPT TỐI ƯU NHẤT (Copy & Paste)

```
Hãy tạo hệ thống admin để quản lý venues cho dự án Asia Night Life:

CONTEXT:
- Project: Next.js 15 + Supabase + TypeScript
- Database: Table venues đã có (xem VENUE_MIGRATION_PLAN.md)
- UI: Sử dụng shadcn/ui components
- Auth: Supabase Auth (đã setup)

YÊU CẦU:

1. ADMIN LAYOUT (src/app/admin/layout.tsx):
   - Sidebar navigation: Dashboard, Venues, DJs, Employees
   - Header với user profile
   - Protected route (check auth)
   - Responsive design

2. VENUE LIST (src/app/admin/venues/page.tsx):
   - Table hiển thị: ID, Name, Country, Category, Status
   - Actions: Add New, Edit, Delete
   - Search by name
   - Filter by country, category
   - Pagination (20/page)

3. VENUE FORM (src/app/admin/venues/components/VenueForm.tsx):
   - Fields: name, slug, country, category, address, phone, price, hours, description
   - Validation: react-hook-form + zod
   - Auto-generate slug từ name
   - Image upload: main_image_url + images[] (max 10)
   - Upload to Supabase Storage bucket "venue-images"
   - Actions: Save Draft, Publish, Cancel

4. IMAGE UPLOAD (src/app/admin/venues/components/ImageUpload.tsx):
   - Single + Multiple upload
   - Drag & drop support
   - Preview + Progress
   - Upload to Supabase Storage
   - Delete/reorder images

5. API ROUTES:
   - POST /api/admin/venues - Create
   - PUT /api/admin/venues/[id] - Update
   - DELETE /api/admin/venues/[id] - Delete
   - GET /api/admin/venues/check-slug - Check uniqueness
   - All routes check authentication

6. BULK IMPORT (Optional):
   - Import from CSV/JSON
   - One-click import từ src/lib/data.ts
   - Progress tracking
   - Error handling

Tạo từng file một, bắt đầu từ layout, sau đó list page, rồi form.
Sử dụng shadcn/ui components: Table, Form, Button, Input, Select, Textarea, Dialog.
```

---

## 📚 FILES CẦN TẠO

```
src/app/admin/
├── layout.tsx
├── page.tsx
└── venues/
    ├── page.tsx
    ├── new/page.tsx
    ├── [id]/edit/page.tsx
    └── components/
        ├── VenueForm.tsx
        ├── VenueList.tsx
        ├── ImageUpload.tsx
        └── BulkImport.tsx

src/app/api/admin/venues/
├── route.ts
├── [id]/route.ts
├── check-slug/route.ts
└── bulk-import/route.ts

src/lib/
├── storage-utils.ts
└── venue-validation.ts
```

---

**Estimated Time:** 1-2 hours cho core features  
**Difficulty:** Medium  
**Dependencies:** Supabase setup, shadcn/ui installed
