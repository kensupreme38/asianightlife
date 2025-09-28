import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Music, Radio } from "lucide-react";

export const CategoryTabs = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  
  const categories = [
    { 
      id: "all", 
      name: "Tất Cả", 
      icon: Music, 
      count: 245,
      description: "Mọi loại địa điểm" 
    },
    { 
      id: "ktv", 
      name: "KTVs", 
      icon: Mic, 
      count: 98,
      description: "Phòng karaoke cao cấp" 
    },
    { 
      id: "club", 
      name: "Clubs", 
      icon: Radio, 
      count: 76,
      description: "Câu lạc bộ đêm" 
    },
    { 
      id: "livehouse", 
      name: "Live House", 
      icon: Music, 
      count: 71,
      description: "Không gian nhạc sống" 
    }
  ];

  return (
    <section className="py-8">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            <span className="gradient-text">Loại Hình Giải Trí</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Từ karaoke sang trọng đến club sôi động, chúng tôi có mọi thứ bạn cần cho một đêm tuyệt vời
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <Button
                key={category.id}
                variant="outline"
                className={`h-auto p-6 flex flex-col items-center space-y-4 transition-all duration-300 ${
                  isActive 
                    ? "border-primary bg-gradient-card neon-glow" 
                    : "hover:border-primary/50 hover-glow card-elevated"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <div className={`p-4 rounded-full ${
                  isActive 
                    ? "bg-gradient-primary text-white" 
                    : "bg-secondary text-foreground"
                }`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                
                <div className="text-center">
                  <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {category.description}
                  </p>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    isActive 
                      ? "bg-white/20 text-white" 
                      : "bg-primary/10 text-primary"
                  }`}>
                    {category.count} địa điểm
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
