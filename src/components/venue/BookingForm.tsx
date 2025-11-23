"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock, Users, Gift } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useTranslations } from 'next-intl';

interface BookingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venueName: string;
  venueAddress: string;
}

export const BookingForm = ({
  open,
  onOpenChange,
  venueName,
  venueAddress,
}: BookingFormProps) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState("19:00:00");
  const [logoError, setLogoError] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    pax: "",
    location: "",
    referralCode: "",
  });

  // Load referral code from URL query params
  useEffect(() => {
    const referralCodeFromUrl = searchParams?.get("referral_code");
    if (referralCodeFromUrl) {
      setFormData((prev) => ({
        ...prev,
        referralCode: referralCodeFromUrl,
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate date and time
    if (!selectedDate || !selectedTime) {
      alert(t('bookingForm.pleaseSelectDateTime'));
      return;
    }

    // Combine date and time for booking message
    const bookingDateTime = `${format(
      selectedDate,
      "yyyy-MM-dd"
    )} ${selectedTime}`;

    // Fetch employee info if referral code is provided
    let employeeInfo = "";
    if (formData.referralCode) {
      try {
        const supabase = createClient();
        const { data: employee, error } = await supabase
          .from("employee_profiles")
          .select("full_name, phone")
          .eq("referral_code", formData.referralCode.toUpperCase())
          .maybeSingle();

        if (!error && employee) {
          employeeInfo = `\n${t('bookingForm.referralEmployee')}: ${employee.full_name}`;
          if (employee.phone) {
            employeeInfo += `\n${t('bookingForm.employeePhone')}: ${employee.phone}`;
          }
        }
      } catch (error) {
        console.error("Error fetching employee info:", error);
      }
    }

    // Prepare booking message
    const message =
      `${t('bookingForm.newBookingRequest')}\n\n` +
      `${t('bookingForm.venue')}: ${venueName}\n` +
      `${t('bookingForm.address')}: ${venueAddress}\n\n` +
      `${t('bookingForm.fullName')}: ${formData.fullName}\n` +
      `${t('bookingForm.phone')}: ${formData.phoneNumber}\n` +
      `${t('bookingForm.bookingDateTimeLabel')}: ${bookingDateTime}\n` +
      `${t('bookingForm.numberOfPeopleLabel')}: ${formData.pax}\n` +
      `${t('bookingForm.locationBranchLabel')}: ${formData.location || "N/A"}\n\n` +
      (formData.referralCode
        ? `${t('bookingForm.referralCodeLabel')}: ${formData.referralCode}${employeeInfo}`
        : "");

    // Open WhatsApp with booking details
    window.open(
      `https://wa.me/6582808072?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    // Reset form
    setSelectedDate(new Date());
    setSelectedTime("19:00:00");
    const referralCodeFromUrl = searchParams?.get("referral_code") || "";
    setFormData({
      fullName: "",
      phoneNumber: "",
      pax: "",
      location: "",
      referralCode: referralCodeFromUrl,
    });

    // Close dialog
    onOpenChange(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {logoError ? (
              <div
                className="bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs object-cover rounded"
                style={{ width: 40, height: 40 }}
              >
                ANL
              </div>
            ) : (
              <Image
                src="/logo.jpg"
                alt="Asia Night Life Logo"
                width={40}
                height={40}
                className="object-cover rounded"
                onError={() => setLogoError(true)}
                loading="lazy"
                unoptimized
              />
            )}
            <DialogTitle className="text-2xl font-bold">
              {t('bookingForm.makeBooking')}
            </DialogTitle>
          </div>
          <DialogDescription>
            {t('bookingForm.fillDetails', { venueName })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">{t('bookingForm.name')} *</Label>
            <Input
              id="fullName"
              type="text"
              placeholder={t('bookingForm.namePlaceholder')}
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">{t('bookingForm.phoneNumber')} *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder={t('bookingForm.phonePlaceholder')}
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              required
            />
          </div>

          {/* Booking Date & Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t('bookingForm.bookingDateTime')} *
            </Label>
            <div className="grid grid-cols-[2fr,1fr] gap-2">
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : t('bookingForm.pickDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>

              {/* Time Picker */}
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                step="1800"
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>

          {/* Number of People (Pax) */}
          <div className="space-y-2">
            <Label htmlFor="pax" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('bookingForm.numberOfPeople')} *
            </Label>
            <Select
              value={formData.pax}
              onValueChange={(value) => handleChange("pax", value)}
              required
            >
              <SelectTrigger id="pax">
                <SelectValue placeholder={t('bookingForm.selectPeople')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 {t('bookingForm.person')}</SelectItem>
                <SelectItem value="2">2 {t('bookingForm.people')}</SelectItem>
                <SelectItem value="3">3 {t('bookingForm.people')}</SelectItem>
                <SelectItem value="4">4 {t('bookingForm.people')}</SelectItem>
                <SelectItem value="5">5 {t('bookingForm.people')}</SelectItem>
                <SelectItem value="6">6 {t('bookingForm.people')}</SelectItem>
                <SelectItem value="7">7 {t('bookingForm.people')}</SelectItem>
                <SelectItem value="8">8 {t('bookingForm.people')}</SelectItem>
                <SelectItem value="9">9 {t('bookingForm.people')}</SelectItem>
                <SelectItem value="10">10+ {t('bookingForm.people')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location / Shop Branch */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {t('bookingForm.locationBranch')}
            </Label>
            <Input
              id="location"
              type="text"
              placeholder={t('bookingForm.locationPlaceholder')}
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          {/* Referral Code */}
          <div className="space-y-2">
            <Label htmlFor="referralCode" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              {t('bookingForm.referralCode')}
            </Label>
            <Input
              id="referralCode"
              type="text"
              placeholder={t('bookingForm.referralPlaceholder')}
              value={formData.referralCode}
              onChange={(e) =>
                handleChange("referralCode", e.target.value.toUpperCase())
              }
              className="font-mono"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="neon"
              className="min-w-[120px]"
              disabled={!selectedDate || !selectedTime}
            >
              {t('bookingForm.submitBooking')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
