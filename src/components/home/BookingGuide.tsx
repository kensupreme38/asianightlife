'use client';

import { MapPin, Phone, Headset, Check, Sparkles, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

// Define types for the steps
type SingleStep = {
  icon: LucideIcon;
  title: string;
  description: string;
  isDouble?: false;
};

type DoubleStepOption = {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: string;
}

type DoubleStep = {
  isDouble: true;
  options: [DoubleStepOption, DoubleStepOption];
};

type Step = SingleStep | DoubleStep;


const steps: Step[] = [
  {
    icon: MapPin,
    title: "CHOOSE A VENUE",
    description: "Thousands of discounted venues",
  },
  {
    isDouble: true,
    options: [
      {
        icon: Phone,
        title: "BOOK BY PHONE",
        description: "0868.460.008",
      },
      {
        icon: Headset,
        title: "BOOK ONLINE",
        description: "Visit Website",
        link: "https://www.9life.com.vn"
      }
    ]
  },
  {
    icon: Check,
    title: "CONFIRMATION",
    description: "Confirmation from Asia Night Life.SG operator",
  },
  {
    icon: Sparkles,
    title: "EXPERIENCE",
    description: "Experience the service",
  },
];

const StepIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
  <div className="relative mb-4">
    <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-neon-blue to-neon-pink shadow-lg neon-glow animate-float`}>
      <Icon className="h-10 w-10 text-white" />
    </div>
  </div>
);

const StepCard = ({ number, title, description, icon }: {number: number; title: string; description: string; icon: React.ElementType}) => (
  <div className="relative flex flex-col items-center text-center">
    <StepIcon icon={icon} />
    <h3 className="text-lg font-bold text-primary">{title}</h3>
    <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background font-bold text-primary">
      {number}
    </div>
  </div>
)

const DoubleStepComponent = ({ number, options }: { number: number; options: [DoubleStepOption, DoubleStepOption] }) => (
  <div className="relative flex flex-col items-center text-center">
    <div className="flex items-start justify-center gap-8">
      <div>
        <StepIcon icon={options[0].icon} />
        <h3 className="text-lg font-bold text-primary">{options[0].title}</h3>
        <p className="text-muted-foreground mt-1 text-sm">{options[0].description}</p>
      </div>
      <span className="text-muted-foreground font-bold mt-10">Or</span>
      <div>
        <StepIcon icon={options[1].icon} />
        <h3 className="text-lg font-bold text-primary">{options[1].title}</h3>
        {options[1].link ? (
           <Link href={options[1].link} target="_blank" rel="noopener noreferrer">
              <p className="text-muted-foreground mt-1 hover:text-primary transition-colors text-sm">{options[1].description}</p>
           </Link>
        ) : (
          <p className="text-muted-foreground mt-1 text-sm">{options[1].description}</p>
        )}
      </div>
    </div>
    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background font-bold text-primary">
      {number}
    </div>
  </div>
);


export const BookingGuide = () => {

  const renderStep = (step: Step, index: number) => {
    if (step.isDouble) {
      return <DoubleStepComponent key={index} number={index + 1} options={step.options} />;
    }
    return <StepCard key={index} number={index + 1} title={step.title} description={step.description} icon={step.icon} />;
  };

  return (
    <section className="py-24 bg-secondary/20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Booking Guide</h2>
          <p className="text-muted-foreground">
            See detailed guide <Link href="#" className="text-primary hover:underline">here</Link>
          </p>
        </div>

        <div className="hidden lg:flex items-start justify-between relative">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              {renderStep(step, index)}
              {index < steps.length - 1 && (
                 <div className="flex-1 border-t-2 border-dashed border-border mt-12 mx-4"></div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Mobile View */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-y-20 gap-x-8">
          {steps.map((step, index) => renderStep(step, index))}
        </div>

      </div>
    </section>
  );
};
