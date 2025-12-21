"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateReferralCode } from "@/lib/utils";
import { useTranslations } from "next-intl";

const EMPLOYEE_IMAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_DJ_BUCKET || "djpro5";
const EMPLOYEE_IMAGE_FOLDER =
  process.env.NEXT_PUBLIC_SUPABASE_EMPLOYEE || "employee";

const employeeFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional().or(z.literal("")),
  date_of_birth: z.date({
    required_error: "Date of birth is required",
  }),
  gender: z.enum(["male", "female"], {
    required_error: "Please select a gender",
  }),
  address: z.string().optional().or(z.literal("")),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface EmployeeProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}

interface EmployeeCreateFormProps {
  employeeData?: EmployeeProfile | null;
}

export default function EmployeeCreateForm({
  employeeData,
}: EmployeeCreateFormProps) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const isEdit = !!employeeData;

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      email: currentUser?.email || "",
      full_name: "",
      phone: "",
      date_of_birth: undefined,
      gender: "male",
      address: "",
    },
  });

  // Update form when currentUser is loaded or employeeData is provided
  useEffect(() => {
    if (currentUser?.email && !employeeData) {
      form.setValue("email", currentUser.email);
    }
  }, [currentUser, form, employeeData]);

  // Load employee data when in edit mode
  useEffect(() => {
    if (employeeData) {
      form.reset({
        email: employeeData.email || currentUser?.email || "",
        full_name: employeeData.full_name || "",
        phone: employeeData.phone || "",
        date_of_birth: employeeData.date_of_birth
          ? new Date(employeeData.date_of_birth)
          : undefined,
        gender: (employeeData.gender as "male" | "female") || "male",
        address: employeeData.address || "",
      });

      if (employeeData.avatar) {
        setExistingImageUrl(employeeData.avatar);
        setImagePreview(employeeData.avatar);
      }
    }
  }, [employeeData, form, currentUser]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
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
    const { data: buckets, error: bucketError } =
      await supabase.storage.listBuckets();

    if (bucketError) {
      const message = bucketError.message?.toLowerCase() ?? "";
      if (
        !(message.includes("permission") || message.includes("not allowed"))
      ) {
        console.warn("Supabase listBuckets failed", bucketError);
      }
    } else {
      bucketExists =
        buckets?.some((bucket) => bucket.name === EMPLOYEE_IMAGE_BUCKET) ??
        false;
      if (!bucketExists) {
        console.warn(
          `Bucket '${EMPLOYEE_IMAGE_BUCKET}' not found when listing. Proceeding to attempt upload.`
        );
      }
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = EMPLOYEE_IMAGE_FOLDER
      ? `${EMPLOYEE_IMAGE_FOLDER}/${fileName}`
      : fileName;

    const { error: uploadError } = await supabase.storage
      .from(EMPLOYEE_IMAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      // Provide more specific error messages
      if (
        uploadError.message.includes("Bucket") ||
        uploadError.message.includes("not found")
      ) {
        throw new Error(
          `Storage bucket not found. Please create '${EMPLOYEE_IMAGE_BUCKET}' bucket in Supabase Storage or update the NEXT_PUBLIC_SUPABASE_EMPLOYEE environment variable.`
        );
      }
      if (uploadError.message.includes("file size")) {
        throw new Error("File is too large. Maximum size is 5MB.");
      }
      if (uploadError.message.toLowerCase().includes("row-level security")) {
        throw new Error(
          "Upload blocked by storage policy. Ensure Supabase storage RLS policies allow authenticated INSERT on the bucket."
        );
      }
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from(EMPLOYEE_IMAGE_BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const onSubmit = async (data: EmployeeFormValues) => {
    if (!currentUser) {
      toast({
        title: t('common.error'),
        description: t('employee.mustLogin'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      let imageUrl: string | null = existingImageUrl || null;

      // Upload image if selected
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
          toast({
            title: "Success",
            description: "Image uploaded successfully",
          });
        } catch (uploadError) {
          // If upload fails, show error and stop submission
          console.error("Image upload failed:", uploadError);
          const errorMessage =
            uploadError instanceof Error
              ? uploadError.message
              : "Failed to upload image. Please try again.";
          toast({
            title: "Upload Error",
            description: errorMessage,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return; // Stop form submission
        }
      }

      // Format date_of_birth as YYYY-MM-DD string
      const dateOfBirthString = format(data.date_of_birth, "yyyy-MM-dd");

      // Prepare employee data according to schema
      const employeePayload: Record<string, unknown> = {
        email: data.email,
        full_name: data.full_name,
        phone: data.phone || null,
        date_of_birth: dateOfBirthString,
        gender: data.gender,
        address: data.address || null,
        avatar: imageUrl,
      };

      if (isEdit && employeeData) {
        // Update existing employee profile
        const { error } = await supabase
          .from("employee_profiles")
          .update(employeePayload)
          .eq("id", employeeData.id);

        if (error) {
          const message =
            error.message ||
            error.details ||
            error.hint ||
            t('employee.profileUpdateFailed');
          throw new Error(message);
        }

        toast({
          title: t('common.success'),
          description: t('employee.profileUpdated'),
        });
      } else {
        // Generate unique referral code based on user_id + timestamp
        // This ensures uniqueness without needing to check database
        const referralCode = generateReferralCode(currentUser.id);

        // Insert new employee profile
        const { error } = await supabase.from("employee_profiles").insert({
          ...employeePayload,
          user_id: currentUser.id,
          referral_code: referralCode,
        });

        if (error) {
          const message =
            error.message ||
            error.details ||
            error.hint ||
            t('employee.profileCreateFailed');
          throw new Error(message);
        }

        toast({
          title: t('common.success'),
          description: `${t('employee.profileCreated')} ${t('bookingForm.referralCodeLabel')}: ${referralCode}`,
        });
      }

      // Reload page to show employee detail view
      router.refresh();
      window.location.href = "/employee";
    } catch (error) {
      console.error("Error creating employee profile:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t('employee.profileCreateFailed');
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-headline">
              {isEdit ? t('employee.editEmployeeProfile') : t('employee.createEmployee')}
            </CardTitle>
            <CardDescription className="mt-2">
              {isEdit
                ? t('employee.updateProfileInfo')
                : t('employee.addNewEmployee')}
            </CardDescription>
          </div>
          <Button onClick={() => router.back()} variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload */}
            <div className="space-y-2">
              <Label>Profile Avatar</Label>
              <div className="space-y-4">
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload an image from your device (JPEG, PNG, WebP, or GIF -
                    Max 5MB)
                  </p>
                </div>
                {imagePreview && (
                  <div className="space-y-2">
                    <Dialog
                      open={isImageDialogOpen}
                      onOpenChange={setIsImageDialogOpen}
                    >
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
                        <DialogTitle className="sr-only">
                          Image Preview
                        </DialogTitle>
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
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="employee@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('employee.emailDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Name */}
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormDescription>
                    {t('employee.fullNameDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+65 1234 5678" {...field} />
                  </FormControl>
                  <FormDescription>
                    Contact phone number (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth *</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={
                        field.value ? format(field.value, "yyyy-MM-dd") : ""
                      }
                      onChange={(e) => {
                        const date = e.target.value
                          ? new Date(e.target.value)
                          : undefined;
                        field.onChange(date);
                      }}
                      max={format(new Date(), "yyyy-MM-dd")}
                      min="1900-01-01"
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    {t('employee.dateOfBirthDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>{t('employee.genderDescription')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="123 Main Street, City, Country"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('employee.addressDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
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
                ) : isEdit ? (
                  t('employee.updateProfile')
                ) : (
                  t('employee.createEmployee')
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
