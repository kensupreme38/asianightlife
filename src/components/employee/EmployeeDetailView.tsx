"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  Edit,
  Gift,
  Copy,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

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
  created_at: string;
  updated_at: string;
}

interface EmployeeDetailViewProps {
  employee: EmployeeProfile;
}

export default function EmployeeDetailView({
  employee,
}: EmployeeDetailViewProps) {
  const router = useRouter();
  const t = useTranslations();
  const [hasCopiedCode, setHasCopiedCode] = useState(false);
  const [hasCopiedUrl, setHasCopiedUrl] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not provided";
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getReferralUrl = () => {
    if (!employee.referral_code) return "";
    const baseUrl =
      process.env.NEXT_PUBLIC_REDIRECT_URL || window.location.origin;
    return `${baseUrl}?referral_code=${employee.referral_code}`;
  };

  const handleCopyReferralCode = async () => {
    if (!employee.referral_code) return;

    try {
      await navigator.clipboard.writeText(employee.referral_code);
      setHasCopiedCode(true);
      toast({
        title: "Copied!",
        description: "Referral code has been copied to clipboard",
      });
      setTimeout(() => setHasCopiedCode(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Error",
        description: "Failed to copy referral code",
        variant: "destructive",
      });
    }
  };

  const handleCopyReferralUrl = async () => {
    if (!employee.referral_code) return;

    const referralUrl = getReferralUrl();

    try {
      await navigator.clipboard.writeText(referralUrl);
      setHasCopiedUrl(true);
      toast({
        title: "Copied!",
        description: "Referral URL has been copied to clipboard",
      });
      setTimeout(() => setHasCopiedUrl(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Error",
        description: "Failed to copy referral URL",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-headline">
            {t('employee.employeeProfile')}
          </CardTitle>
          <Button
            variant="outline"
            onClick={() => router.push("/employee?edit=true")}
          >
            <Edit className="h-4 w-4 mr-2" />
            {t('employee.editProfile')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={employee.avatar || undefined}
                alt={employee.full_name}
              />
              <AvatarFallback className="text-2xl">
                {getInitials(employee.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{employee.full_name}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{employee.email}</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Phone
                </p>
                <p className="text-base">{employee.phone || "Not provided"}</p>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </p>
                <p className="text-base">
                  {formatDate(employee.date_of_birth)}
                </p>
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Gender
                </p>
                <p className="text-base capitalize">
                  {employee.gender || "Not provided"}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Address
                </p>
                <p className="text-base">
                  {employee.address || "Not provided"}
                </p>
              </div>
            </div>

            {/* Referral Code */}
            {employee.referral_code && (
              <div className="flex items-start gap-3 md:col-span-2">
                <Gift className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 space-y-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Referral Information
                  </p>

                  {/* Referral Code */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Referral Code
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-mono font-semibold text-primary flex-1">
                        {employee.referral_code}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 flex-shrink-0"
                        onClick={handleCopyReferralCode}
                        title="Copy referral code"
                      >
                        {hasCopiedCode ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Referral URL */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Referral URL
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono text-muted-foreground break-all flex-1">
                        {getReferralUrl()}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 flex-shrink-0"
                        onClick={handleCopyReferralUrl}
                        title="Copy referral URL"
                      >
                        {hasCopiedUrl ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="pt-6 border-t text-sm text-muted-foreground">
            <p>Created: {format(new Date(employee.created_at), "PPpp")}</p>
            {employee.updated_at &&
              employee.updated_at !== employee.created_at && (
                <p>
                  Last updated: {format(new Date(employee.updated_at), "PPpp")}
                </p>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
