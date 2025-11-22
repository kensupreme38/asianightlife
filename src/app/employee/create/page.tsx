"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import EmployeeCreateForm from "@/components/employee/EmployeeCreateForm";
import { UserPlus } from "lucide-react";

export default function CreateEmployeePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("q") || "";

  const handleSearchChange = (query: string) => {
    const newParams = new URLSearchParams(searchParams?.toString() ?? "");
    if (query) {
      newParams.set("q", query);
    } else {
      newParams.delete("q");
    }
    router.push(`/?${newParams.toString()}`);
  };

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
                  <UserPlus className="h-6 w-6 text-red-orange fill-current" />
                  <span className="text-sm font-medium text-red-orange uppercase tracking-wide">
                    Create Employee
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight font-headline">
                  <span className="gradient-text">Create Employee</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Add a new employee to the system with complete profile information
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <div className="container px-3 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal animation="fade-up" delay={100} threshold={0.2}>
              <EmployeeCreateForm />
            </ScrollReveal>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

