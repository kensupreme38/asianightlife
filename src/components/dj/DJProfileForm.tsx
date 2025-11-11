"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Loader2, Upload, Music2, X, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { cn } from "@/lib/utils";

const DJ_IMAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_DJ_BUCKET || "dj-images";
const DJ_IMAGE_FOLDER = (process.env.NEXT_PUBLIC_SUPABASE_DJ_FOLDER || "dj-profiles").replace(/^\/+|\/+$/g, "");

// Country list for autocomplete
const COUNTRIES = [
  "Singapore",
  "Vietnam",
  "Thailand",
  "Malaysia",
  "Cambodia",
  "Indonesia",
  "Japan",
  "Macao",
  "Philippines",
  "South Korea",
  "Taiwan",
  "China",
  "Hong Kong",
  "Myanmar",
  "Laos",
  "Brunei",
];

interface DJProfileFormProps {
  isEdit?: boolean;
}

export default function DJProfileForm({ isEdit = false }: DJProfileFormProps) {
  const router = useRouter();
  const { currentUser, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    genres: "",
    country: "",
  });
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCountryInputFocused, setIsCountryInputFocused] = useState(false);
  const countryInputRef = useRef<HTMLInputElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/login");
      return;
    }

    if (isEdit && currentUser) {
      fetchDJProfile();
    }
  }, [currentUser, authLoading, isEdit]);

  const fetchDJProfile = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      
      // Fetch current user's DJ profile
      const { data: dj, error } = await supabase
        .from("djs")
        .select("*")
        .eq("user_id", currentUser?.id)
        .single();

      if (error) {
        if (error.code === "PGRST116" || error.message?.includes("No rows")) {
          // No profile found, redirect to create if trying to edit
          toast({
            title: "No profile found",
            description: "Creating a new profile instead",
          });
          router.push("/dj/profile/new");
          return;
        }
        throw error;
      }

      if (dj) {
        setFormData({
          name: dj.name || "",
          bio: dj.bio || "",
          genres: Array.isArray(dj.genres) ? dj.genres.join(", ") : dj.genres || "",
          country: dj.country || "",
        });
        const existingUrl = dj.image_url || "";
        setExistingImageUrl(existingUrl);
        setImagePreview(existingUrl || null);
      }
    } catch (error) {
      console.error("Error fetching DJ profile:", error);
      toast({
        title: "Error",
        description: "Failed to load DJ profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, WebP, or GIF)",
          variant: "destructive",
        });
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const supabase = createClient();
    
    // Check if bucket exists, if not, provide helpful error
    let bucketExists = true;
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    if (bucketError) {
      const message = bucketError.message?.toLowerCase() ?? "";
      if (!(message.includes("permission") || message.includes("not allowed"))) {
        console.warn("Supabase listBuckets failed", bucketError);
      }
    } else {
      bucketExists = buckets?.some((bucket) => bucket.name === DJ_IMAGE_BUCKET) ?? false;
      if (!bucketExists) {
        console.warn(`Bucket '${DJ_IMAGE_BUCKET}' not found when listing. Proceeding to attempt upload.`);
      }
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = DJ_IMAGE_FOLDER ? `${DJ_IMAGE_FOLDER}/${fileName}` : fileName;

    const { error: uploadError } = await supabase.storage
      .from(DJ_IMAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      // Provide more specific error messages
      if (uploadError.message.includes("Bucket") || uploadError.message.includes("not found")) {
        throw new Error(`Storage bucket not found. Please create '${DJ_IMAGE_BUCKET}' bucket in Supabase Storage or update the NEXT_PUBLIC_SUPABASE_DJ_BUCKET environment variable.`);
      }
      if (uploadError.message.includes("file size")) {
        throw new Error("File is too large. Maximum size is 5MB.");
      }
      if (uploadError.message.toLowerCase().includes("row-level security")) {
        throw new Error("Upload blocked by storage policy. Ensure Supabase storage RLS policies allow authenticated INSERT on the bucket.");
      }
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from(DJ_IMAGE_BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      let imageUrl = existingImageUrl; // Keep existing image if no new file uploaded

      // Upload new image if selected
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
          toast({
            title: "Success",
            description: "Image uploaded successfully",
          });
        } catch (uploadError: any) {
          // If upload fails, show error and stop submission
          console.error("Image upload failed:", uploadError);
          toast({
            title: "Upload Error",
            description: uploadError.message || "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return; // Stop form submission
        }
      }

      // Parse genres
      const genres = formData.genres
        .split(",")
        .map((g) => g.trim())
        .filter((g) => g.length > 0);

      const djData = {
        name: formData.name,
        bio: formData.bio,
        genres,
        country: formData.country,
        image_url: imageUrl,
        user_id: currentUser.id,
      };

      if (isEdit) {
        // Update existing profile
        const { error } = await supabase
          .from("djs")
          .update(djData)
          .eq("user_id", currentUser.id);
 
        if (error) {
          const message = error.message || error.details || error.hint || "Unknown error updating profile";
          throw new Error(message);
        }
 
        toast({
          title: "Success",
          description: "DJ profile updated successfully!",
        });
      } else {
        // Create new profile
        const { error } = await supabase.from("djs").insert(djData);
 
        if (error) {
          const message = error.message || error.details || error.hint || "Unknown error creating profile";
          throw new Error(message);
        }
 
        toast({
          title: "Success",
          description: "DJ profile created successfully!",
        });
      }
 
      router.push("/dj");
    } catch (error: any) {
      console.error("Error saving DJ profile:", error, error?.message, error?.details, error?.hint);
      toast({
        title: "Error",
        description: error.message || "Failed to save DJ profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const searchParams = useSearchParams();
  const searchQuery = useMemo(() => searchParams?.get("q") || "", [searchParams]);

  const handleSearchChange = useCallback((query: string) => {
    const newParams = new URLSearchParams(searchParams?.toString() ?? "");
    if (query) {
      newParams.set("q", query);
    } else {
      newParams.delete("q");
    }
    router.push(`/?${newParams.toString()}`);
  }, [router, searchParams]);

  // Filter countries based on input
  const filteredCountries = useMemo(() => {
    if (!formData.country) {
      return COUNTRIES;
    }
    const query = formData.country.toLowerCase();
    return COUNTRIES.filter((country) =>
      country.toLowerCase().includes(query)
    );
  }, [formData.country]);

  // Handle country input change
  const handleCountryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, country: value });
    // Open dropdown if input is focused and there are suggestions
    if (isCountryInputFocused && filteredCountries.length > 0) {
      setIsCountryDropdownOpen(true);
    }
  };

  // Handle country selection
  const handleCountrySelect = (country: string) => {
    setFormData({ ...formData, country });
    setIsCountryDropdownOpen(false);
    setIsCountryInputFocused(false);
    countryInputRef.current?.blur();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isCountryDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        countryInputRef.current &&
        countryDropdownRef.current &&
        !countryInputRef.current.contains(target) &&
        !countryDropdownRef.current.contains(target)
      ) {
        setIsCountryDropdownOpen(false);
        setIsCountryInputFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCountryDropdownOpen]);

  // Handle keyboard navigation
  const handleCountryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsCountryDropdownOpen(false);
      setIsCountryInputFocused(false);
    } else if (e.key === "Enter" && filteredCountries.length > 0 && isCountryDropdownOpen) {
      e.preventDefault();
      handleCountrySelect(filteredCountries[0]);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />
      <main>
        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b">
          <div className="container px-3">
            <ScrollReveal animation="fade-up" delay={0} threshold={0.2}>
              <div className="max-w-3xl mx-auto text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Music2 className="h-6 w-6 text-red-orange fill-current" />
                  <span className="text-sm font-medium text-red-orange uppercase tracking-wide">
                    {isEdit ? "Edit Profile" : "Create Profile"}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight font-headline">
                  <span className="gradient-text">
                    {isEdit ? "Edit DJ Profile" : "Create DJ Profile"}
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {isEdit
                    ? "Update your DJ profile information and keep your fans updated"
                    : "Create your DJ profile to start receiving votes and connect with fans"}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <div className="container px-3 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal animation="fade-up" delay={100} threshold={0.2}>
              <Card className="card-elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-headline">
                        {isEdit ? "Profile Information" : "Profile Details"}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {isEdit
                          ? "Update your profile information below"
                          : "Fill in the information below to create your DJ profile"}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => router.push("/dj")}
                      variant="ghost"
                      size="icon"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <div className="space-y-4">
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload an image from your device (JPEG, PNG, WebP, or GIF - Max 5MB)
                    </p>
                  </div>
                  {imagePreview && (
                    <div className="space-y-2">
                      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                        <DialogTrigger asChild>
                          <div className="relative w-40 h-40 rounded-lg overflow-hidden border shadow-md cursor-pointer hover:opacity-90 transition-opacity group">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={() => {
                                setImagePreview(null);
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                              <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to view
                              </span>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-full p-0">
                          <DialogTitle className="sr-only">Image Preview</DialogTitle>
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background"
                              onClick={() => setIsImageDialogOpen(false)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <img
                              src={imagePreview}
                              alt="Image Preview"
                              className="w-full h-auto max-h-[80vh] object-contain"
                              onError={() => {
                                setImagePreview(null);
                                setIsImageDialogOpen(false);
                              }}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                      <p className="text-xs text-muted-foreground">
                        Click on the image to view full size
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">DJ Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your DJ name"
                  required
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself..."
                  rows={5}
                />
              </div>

              {/* Genres */}
              <div className="space-y-2">
                <Label htmlFor="genres">Genres</Label>
                <Input
                  id="genres"
                  value={formData.genres}
                  onChange={(e) =>
                    setFormData({ ...formData, genres: e.target.value })
                  }
                  placeholder="House, Techno, EDM (comma-separated)"
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple genres with commas
                </p>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <div className="relative">
                  <Input
                    ref={countryInputRef}
                    id="country"
                    value={formData.country}
                    onChange={handleCountryInputChange}
                    onFocus={() => {
                      setIsCountryInputFocused(true);
                      if (filteredCountries.length > 0) {
                        setIsCountryDropdownOpen(true);
                      }
                    }}
                    onBlur={() => {
                      // Delay to allow click on dropdown item
                      setTimeout(() => {
                        if (!countryDropdownRef.current?.contains(document.activeElement)) {
                          setIsCountryInputFocused(false);
                        }
                      }, 200);
                    }}
                    onKeyDown={handleCountryKeyDown}
                    placeholder="Singapore, Vietnam, Thailand..."
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input blur
                    }}
                    onClick={() => {
                      if (filteredCountries.length > 0) {
                        setIsCountryDropdownOpen(!isCountryDropdownOpen);
                        setIsCountryInputFocused(true);
                        if (!isCountryDropdownOpen) {
                          countryInputRef.current?.focus();
                        }
                      }
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isCountryDropdownOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isCountryDropdownOpen && filteredCountries.length > 0 && (
                    <div
                      ref={countryDropdownRef}
                      className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto"
                    >
                      {filteredCountries.map((country) => (
                        <button
                          key={country}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer first:rounded-t-md last:rounded-b-md"
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent input blur
                          }}
                        >
                          {country}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Start typing to see suggestions or select from the list
                </p>
              </div>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/dj")}
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none h-14 text-base"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        variant="default" 
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none h-14 text-base"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            {isEdit ? "Updating..." : "Creating..."}
                          </>
                        ) : (
                          <>
                            {isEdit ? "Update Profile" : "Create Profile"}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

