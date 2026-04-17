# 🚀 VENUE DATA MIGRATION PLAN
## From Hardcoded Data to Supabase Database

**Created:** 2026-03-11  
**Project:** Asia Night Life Platform  
**Purpose:** Migrate 230+ venues from `src/lib/data.ts` to Supabase database

---

## 📊 PHÂN TÍCH CẤU TRÚC DỮ LIỆU HIỆN TẠI

### 1. File Data Hiện Tại
- **Location:** `src/lib/data.ts`
- **Size:** 9,710 lines
- **Total Venues:** 230 venues
- **Format:** TypeScript array export

### 2. Cấu Trúc Dữ Liệu Venue

```typescript
interface Venue {
  id: number;                    // Unique ID (1-230)
  name: string;                  // Venue name
  slug?: string;                 // URL-friendly slug (optional, only ~20 venues have it)
  main_image_url: string;        // Main cover image
  images: string[];              // Array of additional images (0-10 images)
  address: string;               // Full address
  country: string;               // Country (Singapore, Vietnam, Thailand, Malaysia)
  phone: string;                 // Contact phone
  category: string;              // Category (KTV, Club, Live House, Bar, etc.)
  price: string;                 // Price range (free text)
  description: string;           // Markdown formatted description
  hours: string;                 // Operating hours (free text)
}
```

### 3. Phân Tích Chi Tiết

#### Countries Distribution:
- Singapore: ~50 venues
- Vietnam: ~120 venues  
- Thailand: ~50 venues
- Malaysia: ~10 venues

#### Categories:
- KTV: ~180 venues
- Club: ~30 venues
- Live House: ~10 venues
- Bar/Lounge: ~10 venues

#### Data Quality:
- **ID:** Sequential, some gaps (1, 79, 80, 81, 82...)
- **Slug:** Only recent venues have slug field (~20 venues)
- **Images:** Variable count (0-10 images per venue)
- **Description:** Markdown format with ## headers
- **Hours:** Free text format (inconsistent)

---

## 🎯 KẾ HOẠCH MIGRATION

### Phase 1: Database Schema Setup
1. Create `venues` table in Supabase
2. Add indexes for performance
3. Setup RLS policies
4. Create helper functions

### Phase 2: Data Migration Script
1. Read data from `src/lib/data.ts`
2. Generate slugs for venues without slug
3. Validate and clean data
4. Batch insert to Supabase
5. Verify data integrity

### Phase 3: API Update
1. Update `/api/venues` routes to use database
2. Add caching strategy
3. Update error handling
4. Test all endpoints

### Phase 4: Admin Interface
1. Create admin dashboard
2. Add CRUD operations for venues
3. Image upload functionality
4. Bulk import/export features

### Phase 5: Testing & Deployment
1. Test all venue pages
2. Verify SEO (sitemap, metadata)
3. Performance testing
4. Deploy to production

---

## 📝 IMPLEMENTATION TASKS

### Task 1: Create Database Schema

**File:** `supabase/migrations/001_create_venues_table.sql`

```sql
-- Create venues table
CREATE TABLE venues (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  main_image_url TEXT,
  images TEXT[] DEFAULT '{}',
  address TEXT,
  country TEXT,
  phone TEXT,
  category TEXT,
  price TEXT,
  description TEXT,
  hours TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_venues_country ON venues(country);
CREATE INDEX idx_venues_category ON venues(category);
CREATE INDEX idx_venues_slug ON venues(slug);
CREATE INDEX idx_venues_status ON venues(status);
CREATE INDEX idx_venues_name ON venues USING gin(to_tsvector('english', name));

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON venues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public venues are viewable by everyone"
  ON venues FOR SELECT
  USING (status = 'active');

-- Authenticated users can insert/update (for admin)
CREATE POLICY "Authenticated users can insert venues"
  ON venues FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update venues"
  ON venues FOR UPDATE
  TO authenticated
  USING (true);
```

### Task 2: Create Migration Script

**File:** `scripts/migrate-venues.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { ktvData } from '../src/lib/data';
import { generateSlug } from '../src/lib/slug-utils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Need service role key

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateVenues() {
  console.log('🚀 Starting venue migration...');
  console.log(`📊 Total venues to migrate: ${ktvData.length}`);

  const venues = ktvData.map((venue) => ({
    id: venue.id,
    name: venue.name,
    slug: venue.slug || generateSlug(venue.name),
    main_image_url: venue.main_image_url || null,
    images: venue.images || [],
    address: venue.address || null,
    country: venue.country || null,
    phone: venue.phone || null,
    category: venue.category || null,
    price: venue.price || null,
    description: venue.description || null,
    hours: venue.hours || null,
    status: 'active',
  }));

  // Batch insert (100 at a time)
  const batchSize = 100;
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < venues.length; i += batchSize) {
    const batch = venues.slice(i, i + batchSize);
    
    console.log(`📦 Inserting batch ${Math.floor(i / batchSize) + 1}...`);
    
    const { data, error } = await supabase
      .from('venues')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Error in batch ${Math.floor(i / batchSize) + 1}:`, error);
      errorCount += batch.length;
    } else {
      successCount += batch.length;
      console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} completed`);
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`✅ Success: ${successCount} venues`);
  console.log(`❌ Errors: ${errorCount} venues`);
  console.log('🎉 Migration completed!');
}

migrateVenues().catch(console.error);
```

### Task 3: Update API Routes

**File:** `src/app/api/venues/route.ts`

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generateSlug } from "@/lib/slug-utils";

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const country = searchParams.get("country");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    const supabase = await createClient();
    
    let query = supabase
      .from("venues")
      .select("*", { count: "exact" })
      .eq("status", "active");

    // Apply search filter
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,address.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    // Apply country filter
    if (country) {
      query = query.eq("country", country);
    }

    // Apply category filter
    if (category) {
      query = query.eq("category", category);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: venues, error, count } = await query;

    if (error) {
      console.error("Error fetching venues:", error);
      return NextResponse.json(
        { error: "Failed to fetch venues" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        venues: venues || [],
        total: count || 0,
        limit,
        offset,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error("Error in GET /api/venues:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

**File:** `src/app/api/venues/[slug]/route.ts`

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 3600;

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createClient();
    
    const { data: venue, error } = await supabase
      .from("venues")
      .select("*")
      .eq("slug", params.slug)
      .eq("status", "active")
      .single();

    if (error || !venue) {
      return NextResponse.json(
        { error: "Venue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(venue, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/venues/[slug]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Task 4: Create Admin Interface

**File:** `src/app/admin/venues/page.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminVenuesPage() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVenue, setEditingVenue] = useState(null);

  useEffect(() => {
    fetchVenues();
  }, []);

  async function fetchVenues() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("venues")
      .select("*")
      .order("id", { ascending: true });

    if (!error) {
      setVenues(data);
    }
    setLoading(false);
  }

  async function handleSave(venue) {
    const supabase = createClient();
    const { error } = await supabase
      .from("venues")
      .upsert(venue);

    if (!error) {
      fetchVenues();
      setEditingVenue(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure?")) return;
    
    const supabase = createClient();
    const { error } = await supabase
      .from("venues")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchVenues();
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Venue Management</h1>
      
      <div className="mb-4">
        <Button onClick={() => setEditingVenue({})}>
          Add New Venue
        </Button>
      </div>

      <div className="grid gap-4">
        {venues.map((venue) => (
          <div key={venue.id} className="border p-4 rounded">
            <h3 className="font-bold">{venue.name}</h3>
            <p className="text-sm text-gray-600">{venue.country} - {venue.category}</p>
            <div className="mt-2 space-x-2">
              <Button size="sm" onClick={() => setEditingVenue(venue)}>
                Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(venue.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingVenue && (
        <VenueEditModal
          venue={editingVenue}
          onSave={handleSave}
          onClose={() => setEditingVenue(null)}
        />
      )}
    </div>
  );
}
```

### Task 5: Update Package.json Scripts

```json
{
  "scripts": {
    "migrate:venues": "tsx scripts/migrate-venues.ts",
    "migrate:check": "tsx scripts/check-migration.ts"
  }
}
```

---

## 🔧 PROMPT ĐỂ THỰC HIỆN

### Prompt 1: Tạo Database Schema

```
Hãy tạo file migration SQL để tạo table `venues` trong Supabase với cấu trúc sau:

1. Tạo file: supabase/migrations/001_create_venues_table.sql
2. Table venues với các fields:
   - id (SERIAL PRIMARY KEY)
   - name (TEXT NOT NULL)
   - slug (TEXT UNIQUE NOT NULL)
   - main_image_url (TEXT)
   - images (TEXT[] - array of image URLs)
   - address (TEXT)
   - country (TEXT)
   - phone (TEXT)
   - category (TEXT)
   - price (TEXT)
   - description (TEXT - markdown format)
   - hours (TEXT)
   - rating (DECIMAL(3,2) DEFAULT 0)
   - status (TEXT DEFAULT 'active')
   - created_at (TIMESTAMP WITH TIME ZONE DEFAULT NOW())
   - updated_at (TIMESTAMP WITH TIME ZONE DEFAULT NOW())

3. Tạo indexes cho: country, category, slug, status, name (full-text search)
4. Tạo trigger để auto-update updated_at
5. Enable RLS với policies:
   - Public read cho venues có status = 'active'
   - Authenticated users có thể insert/update

Sau đó chạy migration này trên Supabase.
```

### Prompt 2: Tạo Migration Script

```
Hãy tạo script để migrate dữ liệu từ src/lib/data.ts vào Supabase:

1. Tạo file: scripts/migrate-venues.ts
2. Script cần:
   - Import ktvData từ src/lib/data.ts
   - Connect tới Supabase với service role key
   - Generate slug cho venues chưa có slug (dùng generateSlug từ src/lib/slug-utils.ts)
   - Batch insert 100 venues mỗi lần
   - Log progress và errors
   - Show summary khi hoàn thành

3. Thêm script vào package.json:
   "migrate:venues": "tsx scripts/migrate-venues.ts"

4. Cần thêm dependency: npm install tsx

5. Cần thêm env variable: SUPABASE_SERVICE_ROLE_KEY (lấy từ Supabase dashboard)
```

### Prompt 3: Update API Routes

```
Hãy cập nhật các API routes để đọc dữ liệu từ Supabase thay vì hardcoded data:

1. Update file: src/app/api/venues/route.ts
   - Thay thế ktvData bằng query từ Supabase
   - Giữ nguyên logic filter (search, country, category)
   - Giữ nguyên pagination
   - Thêm error handling

2. Update file: src/app/api/venues/[slug]/route.ts
   - Query venue by slug từ Supabase
   - Return 404 nếu không tìm thấy
   - Cache response 1 hour

3. Update file: src/app/api/venues/categories/route.ts
   - Query distinct categories từ Supabase

4. Update file: src/app/api/venues/countries/route.ts
   - Query distinct countries từ Supabase

5. Test tất cả endpoints sau khi update
```

### Prompt 4: Tạo Admin Interface

```
Hãy tạo trang admin để quản lý venues:

1. Tạo route: src/app/admin/venues/page.tsx
2. Features cần có:
   - List tất cả venues với pagination
   - Search và filter
   - Add new venue
   - Edit venue (modal hoặc separate page)
   - Delete venue (với confirmation)
   - Upload images (integrate với Supabase Storage)
   - Bulk import từ CSV/JSON

3. Tạo components:
   - VenueList
   - VenueEditForm
   - VenueImageUpload
   - VenueBulkImport

4. Protect route với authentication middleware
5. Chỉ admin users mới có thể access

6. UI sử dụng shadcn/ui components đã có
```

### Prompt 5: Testing & Verification

```
Hãy tạo script để verify migration:

1. Tạo file: scripts/check-migration.ts
2. Script cần check:
   - Total venues trong database = 230
   - Tất cả venues có slug unique
   - Không có null values ở required fields
   - Images array format đúng
   - Countries và categories match với data cũ

3. So sánh data cũ vs mới:
   - Compare từng venue by ID
   - Report differences nếu có
   - Export report ra file

4. Test các API endpoints:
   - GET /api/venues
   - GET /api/venues/[slug]
   - GET /api/venues/categories
   - GET /api/venues/countries

5. Test performance:
   - Query time < 100ms
   - Cache working properly
```

---

## ✅ CHECKLIST THỰC HIỆN

### Pre-Migration
- [ ] Backup dữ liệu hiện tại (export ktvData ra JSON)
- [ ] Setup Supabase project nếu chưa có
- [ ] Get service role key từ Supabase
- [ ] Test connection tới Supabase

### Migration
- [ ] Tạo database schema (Task 1)
- [ ] Run migration SQL trên Supabase
- [ ] Verify table được tạo thành công
- [ ] Tạo migration script (Task 2)
- [ ] Run migration script
- [ ] Verify data trong database

### API Update
- [ ] Update API routes (Task 3)
- [ ] Test tất cả endpoints
- [ ] Verify response format giống cũ
- [ ] Check performance và caching

### Admin Interface
- [ ] Tạo admin pages (Task 4)
- [ ] Test CRUD operations
- [ ] Setup authentication
- [ ] Test image upload

### Testing
- [ ] Run verification script (Task 5)
- [ ] Test trên staging environment
- [ ] Load testing
- [ ] SEO check (sitemap, metadata)

### Deployment
- [ ] Deploy to production
- [ ] Monitor errors
- [ ] Verify all pages working
- [ ] Update documentation

---

## 🚨 ROLLBACK PLAN

Nếu có vấn đề sau migration:

1. **Immediate Rollback:**
   - Revert API routes về version cũ (đọc từ data.ts)
   - Deploy rollback version
   - Investigate issues

2. **Data Rollback:**
   - Truncate venues table
   - Re-run migration với fixes
   - Verify data again

3. **Partial Rollback:**
   - Keep database
   - Use feature flag để switch giữa data.ts và database
   - Fix issues gradually

---

## 📚 TÀI LIỆU THAM KHẢO

- Supabase Docs: https://supabase.com/docs
- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- PostgreSQL Arrays: https://www.postgresql.org/docs/current/arrays.html
- RLS Policies: https://supabase.com/docs/guides/auth/row-level-security

---

**Last Updated:** 2026-03-11  
**Status:** Ready for Implementation
