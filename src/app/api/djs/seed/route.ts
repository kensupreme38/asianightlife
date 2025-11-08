import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Sample DJ data
const sampleDJs = [
  {
    name: 'DJ Neon Lights',
    bio: 'A passionate house music DJ with over 10 years of experience in the Asian nightlife scene. Known for creating electrifying atmospheres with deep house, progressive house, and tech house mixes. Regular performer at top clubs across Singapore, Bangkok, and Tokyo.',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop&q=80',
    genres: ['House', 'Deep House', 'Progressive House', 'Tech House'],
    country: 'Singapore',
  },
  {
    name: 'DJ Thunder',
    bio: 'High-energy EDM specialist bringing the best of big room, future bass, and festival anthems. With a career spanning major festivals and clubs across Asia, DJ Thunder knows how to get the crowd moving. Expect explosive drops and unforgettable moments.',
    image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=800&fit=crop&q=80',
    genres: ['EDM', 'Big Room', 'Future Bass', 'Festival'],
    country: 'Thailand',
  },
  {
    name: 'DJ Smooth Flow',
    bio: 'The go-to DJ for hip-hop and R&B vibes. Specializing in smooth transitions, classic hits, and the latest chart-toppers. Perfect for those late-night sessions where you want to vibe and chill with the best beats.',
    image_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=800&fit=crop&q=80',
    genres: ['Hip-Hop', 'R&B', 'Trap', 'Urban'],
    country: 'Malaysia',
  },
  {
    name: 'DJ Midnight',
    bio: 'Dark, driving techno beats for the underground scene. Known for marathon sets that take you on a journey through the depths of electronic music. A favorite among techno purists and late-night warriors.',
    image_url: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=800&fit=crop&q=80',
    genres: ['Techno', 'Minimal Techno', 'Industrial', 'Dark Techno'],
    country: 'Japan',
  },
  {
    name: 'DJ Aurora',
    bio: 'Trance and progressive house specialist creating euphoric experiences. Known for melodic journeys and uplifting sets that transport you to another dimension. Perfect for sunrise sessions and festival stages.',
    image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=800&fit=crop&q=80',
    genres: ['Trance', 'Progressive Trance', 'Uplifting Trance', 'Progressive House'],
    country: 'South Korea',
  },
  {
    name: 'DJ Fusion',
    bio: 'Versatile DJ who seamlessly blends multiple genres. From commercial hits to underground gems, expect the unexpected. Known for reading the crowd and delivering exactly what they need to keep the energy high all night long.',
    image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=800&fit=crop&q=80',
    genres: ['House', 'EDM', 'Pop', 'Commercial', 'Top 40'],
    country: 'Philippines',
  },
  {
    name: 'DJ Deep Blue',
    bio: 'Deep house and minimal specialist with a focus on groove and atmosphere. Perfect for intimate settings and sophisticated crowds who appreciate the finer details in electronic music.',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop&q=80',
    genres: ['Deep House', 'Minimal House', 'Tech House', 'Melodic House'],
    country: 'Indonesia',
  },
  {
    name: 'DJ Bass Drop',
    bio: 'Heavy bass and dubstep specialist bringing the filthiest drops and hardest beats. If you love headbanging and bass that hits you in the chest, this is your DJ. Regular performer at bass music events and festivals.',
    image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=800&fit=crop&q=80',
    genres: ['Dubstep', 'Bass', 'Trap', 'Bass House'],
    country: 'Vietnam',
  },
  {
    name: 'DJ Caliente',
    bio: 'Latin and reggaeton specialist bringing the hottest Latin beats to Asian nightlife. From reggaeton to salsa, bachata to dembow - if it makes you move, DJ Caliente plays it. The life of every Latin night party.',
    image_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=800&fit=crop&q=80',
    genres: ['Reggaeton', 'Latin', 'Salsa', 'Dembow', 'Bachata'],
    country: 'Singapore',
  },
  {
    name: 'DJ Party Starter',
    bio: 'Open format DJ who knows how to keep any party going. From weddings to clubs, corporate events to festivals - no crowd is too diverse. Expect a perfect mix of current hits, classic anthems, and crowd favorites.',
    image_url: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=800&fit=crop&q=80',
    genres: ['Open Format', 'Commercial', 'Top 40', 'Hip-Hop', 'Pop', 'House'],
    country: 'Thailand',
  },
];

export async function POST(request: Request) {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development mode' },
        { status: 403 }
      );
    }

    const supabase = await createClient();
    
    // Check if user is authenticated (optional - you can remove this check)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get service role key from environment (if available)
    // This allows bypassing RLS for seeding
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    let client = supabase;
    
    // If service role key is available, use it to bypass RLS
    if (serviceRoleKey) {
      const { createClient: createServiceClient } = await import('@supabase/supabase-js');
      client = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      ) as any;
    }

    // Generate a dummy user_id for each DJ (using a consistent UUID pattern)
    // In production, you should use actual user IDs
    const insertedDJs: any[] = [];
    const errors: Array<{ dj: string; error: string }> = [];

    for (let i = 0; i < sampleDJs.length; i++) {
      const dj = sampleDJs[i];
      
      // Generate a consistent UUID for each DJ (for demo purposes)
      // In real scenario, use actual user IDs
      const dummyUserId = `00000000-0000-0000-0000-${String(i + 1).padStart(12, '0')}`;
      
      try {
        const { data, error } = await client
          .from('djs')
          .insert({
            user_id: dummyUserId,
            name: dj.name,
            bio: dj.bio,
            image_url: dj.image_url,
            genres: dj.genres,
            country: dj.country,
            is_active: true,
            status: 'active',
          })
          .select()
          .single();

        if (error) {
          // If error is due to duplicate user_id, skip
          if (error.code === '23505') {
            errors.push({ dj: dj.name, error: 'Already exists (duplicate user_id)' });
            continue;
          }
          errors.push({ dj: dj.name, error: error.message });
        } else {
          insertedDJs.push(data);
        }
      } catch (err: any) {
        errors.push({ dj: dj.name, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      inserted: insertedDJs.length,
      total: sampleDJs.length,
      djs: insertedDJs,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully inserted ${insertedDJs.length} out of ${sampleDJs.length} DJs`,
    });
  } catch (error: any) {
    console.error('Error seeding DJs:', error);
    return NextResponse.json(
      { 
        error: 'Failed to seed DJs',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

