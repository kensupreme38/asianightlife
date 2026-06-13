"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import EmployeeDetailView from "@/components/employee/EmployeeDetailView";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

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
  referral_code: string | null;
  position?: string | null;
  department?: string | null;
  hire_date?: string | null;
  created_at: string;
  updated_at: string;
}

export default function EmployeePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("q") || "";
  const { currentUser, isLoading: authLoading } = useAuth();
  const [employeeProfile, setEmployeeProfile] =
    useState<EmployeeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSearchChange = (query: string) => {
    const newParams = new URLSearchParams(searchParams?.toString() ?? "");
    if (query) {
      newParams.set("q", query);
    } else {
      newParams.delete("q");
    }
    router.push(`/?${newParams.toString()}`);
  };

  useEffect(() => {
    const checkEmployeeProfile = async () => {
      if (authLoading) return;

      if (!currentUser) {
        // Redirect to login if not authenticated
        router.push("/login?redirect=/employee");
        setIsLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("employee_profiles")
          .select("*")
          .eq("email", currentUser.email ?? "")
          .maybeSingle();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching employee profile:", error);
        }

        if (data) {
          setEmployeeProfile(data as EmployeeProfile);
        } else {
          setEmployeeProfile(null);
        }
      } catch (error) {
        console.error("Error checking employee profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkEmployeeProfile();
  }, [currentUser, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!employeeProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        <main>
          <section className="relative w-full py-16 md:py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b">
            <div className="container px-3">
              <ScrollReveal animation="fade-up" delay={0} threshold={0.2}>
                <div className="max-w-3xl mx-auto text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <User className="h-6 w-6 text-red-orange fill-current" />
                  <span className="text-sm font-medium text-red-orange uppercase tracking-wide">
                    ANL Team Member Profile
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight font-headline">
                  <span className="gradient-text">ANL Team Member Profile</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  No team member profile found. Please join as an ANL team member to create your profile.
                </p>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </main>
        <Footer />
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
                  <User className="h-6 w-6 text-red-orange fill-current" />
                  <span className="text-sm font-medium text-red-orange uppercase tracking-wide">
                    ANL Team Member Profile
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight font-headline">
                  <span className="gradient-text">ANL Team Member Profile</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  View your ANL team member profile information
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <div className="container px-3 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal animation="fade-up" delay={100} threshold={0.2}>
              <EmployeeDetailView employee={employeeProfile} />
            </ScrollReveal>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
