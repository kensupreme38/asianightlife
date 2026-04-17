# 🎯 PROMPT: Tạo Chức Năng Upload Venue trong Web Admin

## MỤC TIÊU
Tạo một hệ thống admin hoàn chỉnh để quản lý venues, bao gồm:
- Upload venue mới (single & bulk)
- Edit venue hiện có
- Delete venue
- Upload và quản lý images
- Preview trước khi publish

---

## YÊU CẦU HỆ THỐNG

### 1. Database Schema (Đã có từ migration plan)
```sql
-- Table venues với các fields:
- id, name, slug, main_image_url, images[]
- address, country, phone, category, price
- description (markdown), hours
- rating, status, created_at, updated_at
```

### 2. Tech Stack
- Next.js 15 App Router
- Supabase (Database + Storage)
- shadcn/ui components
- React Hook Form + Zod validation
- TypeScript

### 3. Authentication
- Chỉ authenticated users có quyền truy cập
- Check user role (admin only)

---

## PROMPT CHI TIẾT


### PHASE 1: Setup Admin Route Structure

**Tạo cấu trúc thư mục admin:**

```
src/app/admin/
├── layout.tsx              # Admin layout với sidebar
├── page.tsx                # Admin dashboard
└── venues/
    ├── page.tsx            # Venue list page
    ├── new/
    │   └── page.tsx        # Create new venue
    ├── [id]/
    │   ├── page.tsx        # View venue detail
    │   └── edit/
    │       └── page.tsx    # Edit venue
    └── components/
        ├── VenueForm.tsx
        ├── VenueList.tsx
        ├── VenueCard.tsx
        ├── ImageUpload.tsx
        ├── BulkImport.tsx
        └── DeleteConfirm.tsx
```

**Requirements:**
1. Tạo middleware để protect admin routes
2. Check authentication và admin role
3. Redirect to login nếu chưa đăng nhập
4. Show 403 nếu không phải admin

---

### PHASE 2: Create Venue Form Component

**File: `src/app/admin/venues/components/VenueForm.tsx`**

**Features cần có:**

1. **Form Fields:**
   - Name (required, text input)
   - Slug (auto-generate từ name, có thể edit)
   - Country (required, select dropdown)
   - Category (required, select dropdown)
   - Address (text input)
   - Phone (text input với format validation)
   - Price (text input)
   - Hours (text input)
   - Description (markdown editor hoặc textarea)
   - Main Image (image upload)
   - Additional Images (multiple image upload, max 10)
   - Status (select: active/inactive/draft)

2. **Validation với Zod:**
   - Name: min 3 chars, max 200 chars
   - Slug: unique, lowercase, no spaces
   - Country: required, one of [Singapore, Vietnam, Thailand, Malaysia]
   - Category: required, one of [KTV, Club, Live House, Bar, Lounge]
   - Phone: optional, valid phone format
   - Description: markdown format
   - Images: valid URLs hoặc uploaded files

3. **Auto-generate Slug:**
   - Khi user nhập name, auto-generate slug
   - User có thể edit slug manually
   - Check slug uniqueness real-time

4. **Image Upload:**
   - Upload to Supabase Storage bucket: `venue-images`
   - Show preview sau khi upload
   - Drag & drop support
   - Progress indicator
   - Delete uploaded image
   - Reorder images (drag & drop)

5. **Markdown Editor:**
   - Simple markdown editor cho description
   - Preview tab
   - Support: headers, lists, bold, italic, links

6. **Form Actions:**
   - Save as Draft
   - Publish (status = active)
   - Cancel (confirm nếu có changes)

**Example Code Structure:**
```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const venueSchema = z.object({
  name: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  country: z.enum(["Singapore", "Vietnam", "Thailand", "Malaysia"]),
  category: z.enum(["KTV", "Club", "Live House", "Bar", "Lounge"]),
  // ... other fields
});

export function VenueForm({ venue, onSubmit }) {
  const form = useForm({
    resolver: zodResolver(venueSchema),
    defaultValues: venue || {},
  });

  // Implementation here
}
```

---


### PHASE 3: Image Upload Component

**File: `src/app/admin/venues/components/ImageUpload.tsx`**

**Features:**

1. **Single Image Upload (Main Image):**
   - Click to upload hoặc drag & drop
   - Preview image sau khi chọn
   - Crop/resize option (optional)
   - Upload to Supabase Storage
   - Show upload progress
   - Replace image
   - Delete image

2. **Multiple Images Upload (Gallery):**
   - Upload multiple images cùng lúc
   - Max 10 images
   - Preview grid layout
   - Drag & drop để reorder
   - Delete individual image
   - Set image làm main image

3. **Supabase Storage Integration:**
   - Bucket: `venue-images`
   - Path structure: `venues/{venue-id}/{timestamp}-{filename}`
   - Public URL generation
   - Delete old images khi replace

4. **Image Optimization:**
   - Resize trước khi upload (max 2000px width)
   - Convert to WebP format (optional)
   - Compress quality 85%

**Example Implementation:**
```typescript
"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function ImageUpload({ onUpload, maxImages = 10 }) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);

  async function uploadImage(file: File) {
    const supabase = createClient();
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `venues/${fileName}`;

    const { data, error } = await supabase.storage
      .from("venue-images")
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from("venue-images")
      .getPublicUrl(filePath);

    return publicUrl;
  }

  // Implementation here
}
```

---

### PHASE 4: Venue List & Management

**File: `src/app/admin/venues/page.tsx`**

**Features:**

1. **Venue List Table:**
   - Columns: ID, Name, Country, Category, Status, Actions
   - Sortable columns
   - Pagination (20 items per page)
   - Row actions: View, Edit, Delete

2. **Search & Filter:**
   - Search by name, address
   - Filter by country
   - Filter by category
   - Filter by status
   - Clear filters button

3. **Bulk Actions:**
   - Select multiple venues
   - Bulk delete
   - Bulk status change
   - Bulk export to CSV/JSON

4. **Quick Actions:**
   - Add New Venue button (prominent)
   - Import from CSV/JSON
   - Export all venues
   - Refresh data

5. **Stats Dashboard:**
   - Total venues
   - By country breakdown
   - By category breakdown
   - Recent additions

**Example Layout:**
```typescript
export default function VenuesPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Venue Management</h1>
        <div className="space-x-2">
          <Button onClick={() => router.push('/admin/venues/new')}>
            Add New Venue
          </Button>
          <Button variant="outline">Import</Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <VenueFilters />
      <VenueStats />
      <VenueTable />
    </div>
  );
}
```

---


### PHASE 5: API Routes for Admin

**File: `src/app/api/admin/venues/route.ts`**

**Endpoints cần tạo:**

1. **POST /api/admin/venues** - Create new venue
   - Validate input data
   - Generate slug if not provided
   - Check slug uniqueness
   - Insert to database
   - Return created venue

2. **PUT /api/admin/venues/[id]** - Update venue
   - Validate input data
   - Check venue exists
   - Update database
   - Return updated venue

3. **DELETE /api/admin/venues/[id]** - Delete venue
   - Check venue exists
   - Soft delete (set status = 'deleted')
   - Or hard delete if needed
   - Delete associated images from storage

4. **POST /api/admin/venues/bulk-import** - Bulk import
   - Accept CSV or JSON
   - Validate all entries
   - Batch insert
   - Return success/error report

5. **GET /api/admin/venues/check-slug** - Check slug availability
   - Query parameter: slug
   - Return: { available: boolean }

**Example Implementation:**
```typescript
// POST /api/admin/venues/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generateSlug } from "@/lib/slug-utils";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Check admin role

    const body = await request.json();
    
    // Generate slug if not provided
    if (!body.slug) {
      body.slug = generateSlug(body.name);
    }

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from("venues")
      .select("id")
      .eq("slug", body.slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    // Insert venue
    const { data: venue, error } = await supabase
      .from("venues")
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(venue, { status: 201 });
  } catch (error) {
    console.error("Error creating venue:", error);
    return NextResponse.json(
      { error: "Failed to create venue" },
      { status: 500 }
    );
  }
}
```

---

### PHASE 6: Bulk Import Feature

**File: `src/app/admin/venues/components/BulkImport.tsx`**

**Features:**

1. **Import from CSV:**
   - Upload CSV file
   - Parse CSV data
   - Validate each row
   - Show preview table
   - Map columns to fields
   - Import with progress

2. **Import from JSON:**
   - Upload JSON file
   - Validate JSON structure
   - Show preview
   - Import with progress

3. **Import from data.ts:**
   - One-click import từ existing data.ts
   - Show migration progress
   - Handle errors gracefully
   - Show summary report

4. **Validation & Error Handling:**
   - Validate required fields
   - Check data types
   - Check slug uniqueness
   - Show errors per row
   - Allow skip errors or fix

5. **Progress Tracking:**
   - Show progress bar
   - Current item being processed
   - Success/error count
   - Estimated time remaining

**Example CSV Format:**
```csv
name,country,category,address,phone,price,hours,description
"Iconic KTV","Singapore","KTV","35 Selegie Rd","65 8280 8072","800-900k","4PM - 3AM","Description here"
```

**Example Implementation:**
```typescript
"use client";

import { useState } from "react";
import { parse } from "papaparse";

export function BulkImport() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleImport() {
    setImporting(true);
    
    for (let i = 0; i < data.length; i++) {
      try {
        await fetch("/api/admin/venues", {
          method: "POST",
          body: JSON.stringify(data[i]),
        });
        setProgress((i + 1) / data.length * 100);
      } catch (error) {
        console.error(`Error importing row ${i}:`, error);
      }
    }
    
    setImporting(false);
  }

  // Implementation here
}
```

---


### PHASE 7: Admin Layout & Navigation

**File: `src/app/admin/layout.tsx`**

**Features:**

1. **Sidebar Navigation:**
   - Dashboard
   - Venues (with submenu)
     - All Venues
     - Add New
     - Categories
     - Countries
   - DJs
   - Employees
   - Settings
   - Logout

2. **Header:**
   - Admin title
   - User profile dropdown
   - Notifications (optional)
   - Quick search

3. **Breadcrumbs:**
   - Show current location
   - Clickable navigation

4. **Responsive:**
   - Mobile menu toggle
   - Collapsible sidebar

**Example Implementation:**
```typescript
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

### PHASE 8: Supabase Storage Setup

**Setup Supabase Storage Bucket:**

1. **Create Bucket:**
   - Name: `venue-images`
   - Public: Yes
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

2. **Storage Policies:**
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload venue images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'venue-images');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update venue images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'venue-images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete venue images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'venue-images');

-- Allow public to read
CREATE POLICY "Public can view venue images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'venue-images');
```

3. **Helper Functions:**
```typescript
// src/lib/storage-utils.ts
import { createClient } from "@/utils/supabase/client";

export async function uploadVenueImage(file: File, venueId?: number) {
  const supabase = createClient();
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = venueId 
    ? `venues/${venueId}/${fileName}`
    : `venues/temp/${fileName}`;

  const { data, error } = await supabase.storage
    .from("venue-images")
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from("venue-images")
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteVenueImage(url: string) {
  const supabase = createClient();
  const path = url.split("/venue-images/")[1];
  
  const { error } = await supabase.storage
    .from("venue-images")
    .remove([path]);

  if (error) throw error;
}
```

---


### PHASE 9: Authentication & Authorization

**File: `src/middleware.ts` (Update existing)**

**Add admin route protection:**

```typescript
import { updateSession } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  
  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      // ... config
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Redirect to login if not authenticated
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // TODO: Check if user is admin
    // const { data: profile } = await supabase
    //   .from('user_profiles')
    //   .select('role')
    //   .eq('user_id', user.id)
    //   .single();
    
    // if (profile?.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/403', request.url));
    // }
  }

  return response;
}
```

**Create Admin Role Check:**

```typescript
// src/lib/auth-utils.ts
import { createClient } from "@/utils/supabase/server";

export async function isAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  // Option 1: Check from user metadata
  return user.user_metadata?.role === 'admin';

  // Option 2: Check from separate table
  // const { data: profile } = await supabase
  //   .from('user_profiles')
  //   .select('role')
  //   .eq('user_id', user.id)
  //   .single();
  // return profile?.role === 'admin';
}
```

---

### PHASE 10: Testing & Validation

**Create test cases:**

1. **Form Validation Tests:**
   - Test required fields
   - Test slug generation
   - Test slug uniqueness
   - Test image upload
   - Test markdown parsing

2. **API Tests:**
   - Test create venue
   - Test update venue
   - Test delete venue
   - Test bulk import
   - Test authentication

3. **Integration Tests:**
   - Test full flow: create → edit → delete
   - Test image upload → delete
   - Test bulk import from CSV
   - Test search and filter

4. **Manual Testing Checklist:**
   - [ ] Create new venue with all fields
   - [ ] Upload main image
   - [ ] Upload multiple images
   - [ ] Reorder images
   - [ ] Delete image
   - [ ] Edit venue
   - [ ] Delete venue
   - [ ] Bulk import from CSV
   - [ ] Search venues
   - [ ] Filter by country/category
   - [ ] Check slug uniqueness
   - [ ] Test on mobile
   - [ ] Test permissions

---

