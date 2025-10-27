"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venueName: string;
  venueAddress: string;
}

export const BookingForm = ({ open, onOpenChange, venueName, venueAddress }: BookingFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState("19:00:00");
  
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    pax: "",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate date and time
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time for your booking");
      return;
    }
    
    // Combine date and time for booking message
    const bookingDateTime = `${format(selectedDate, "yyyy-MM-dd")} ${selectedTime}`;
    
    // Prepare booking message
    const message = 
  `New Booking Request\n\n` +
  `Venue: ${venueName}\n` +
  `Address: ${venueAddress}\n\n` +
  `Full Name: ${formData.fullName}\n` +
  `Phone: ${formData.phoneNumber}\n` +
  `Booking Date & Time: ${bookingDateTime}\n` +
  `Number of People: ${formData.pax}\n` +
  `Location/Branch: ${formData.location || 'N/A'}`;

    // Open WhatsApp with booking details
    window.open(
      `https://wa.me/6582808072?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    // Reset form
    setSelectedDate(new Date());
    setSelectedTime("19:00:00");
    setFormData({
      fullName: "",
      phoneNumber: "",
      pax: "",
      location: "",
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
          <DialogTitle className="text-2xl font-bold">Make a Booking</DialogTitle>
          <DialogDescription>
            Fill in your details to make a reservation at {venueName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              required
            />
          </div>

          {/* Booking Date & Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Booking Date & Time *
            </Label>
            <div className="grid grid-cols-2 gap-2">
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
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
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
              Number of People *
            </Label>
            <Select
              value={formData.pax}
              onValueChange={(value) => handleChange("pax", value)}
              required
            >
              <SelectTrigger id="pax">
                <SelectValue placeholder="Select number of people" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Person</SelectItem>
                <SelectItem value="2">2 People</SelectItem>
                <SelectItem value="3">3 People</SelectItem>
                <SelectItem value="4">4 People</SelectItem>
                <SelectItem value="5">5 People</SelectItem>
                <SelectItem value="6">6 People</SelectItem>
                <SelectItem value="7">7 People</SelectItem>
                <SelectItem value="8">8 People</SelectItem>
                <SelectItem value="9">9 People</SelectItem>
                <SelectItem value="10">10+ People</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location / Shop Branch */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Location / Shop Branch
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="Enter location or branch (optional)"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="neon" 
              className="min-w-[120px]"
              disabled={!selectedDate || !selectedTime}
            >
              Submit Booking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

