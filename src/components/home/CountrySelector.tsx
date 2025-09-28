import { useState } from "react";
import { Button } from "@/components/ui/button";

export const CountrySelector = () => {
  const [selectedCountry, setSelectedCountry] = useState("all");
  
  const countries = [
    { id: "all", name: "Tất Cả", flag: "🌏", count: 245 },
    { id: "singapore", name: "Singapore", flag: "🇸🇬", count: 87 },
    { id: "vietnam", name: "Vietnam", flag: "🇻🇳", count: 64 },
    { id: "thailand", name: "Thailand", flag: "🇹🇭", count: 52 },
    { id: "malaysia", name: "Malaysia", flag: "🇲🇾", count: 42 }
  ];

  return (
    <section className="py-8 border-b border-border/40">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Chọn Quốc Gia</h2>
            <p className="text-muted-foreground">Khám phá các địa điểm giải trí hàng đầu</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {countries.map((country) => (
              <Button
                key={country.id}
                variant={selectedCountry === country.id ? "neon" : "outline"}
                className={`flex items-center space-x-2 px-4 py-2 transition-all duration-300 ${
                  selectedCountry === country.id 
                    ? "neon-glow" 
                    : "hover:border-primary/50 hover-glow"
                }`}
                onClick={() => setSelectedCountry(country.id)}
              >
                <span className="text-lg">{country.flag}</span>
                <span className="font-medium">{country.name}</span>
                <span className="text-xs bg-background/20 px-2 py-1 rounded-full">
                  {country.count}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
