import { useState } from "react";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const sortOptions = [
    { value: "recommended", label: "Được Đề Xuất" },
    { value: "price", label: "Giá Cả" },
    { value: "looks", label: "Đẹp Nhất" },
    { value: "playability", label: "Vui Nhất" }
  ];

  return (
    <section className="py-8 bg-secondary/20">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm địa điểm, khu vực..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-background/60 backdrop-blur-sm border-border/40 focus:border-primary"
              />
            </div>

            {/* Location */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-neon-pink" />
              <span>Khu vực hiện tại</span>
            </div>

            {/* Sort Select */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 h-12 bg-background/60 backdrop-blur-sm border-border/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter Button */}
            <Button variant="outline" size="lg" className="h-12 px-6">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Bộ Lọc
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
