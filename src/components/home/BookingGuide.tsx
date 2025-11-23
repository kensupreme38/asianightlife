"use client";

import {
  MapPin,
  Phone,
  Headset,
  Check,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import React, { useMemo } from "react";
import { useTranslations } from 'next-intl';

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
};

type DoubleStep = {
  isDouble: true;
  options: [DoubleStepOption, DoubleStepOption];
};

type Step = SingleStep | DoubleStep;

const StepIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
  <div className="relative mb-4">
    <div
      className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-deep to-red-orange shadow-lg neon-glow animate-float`}
    >
      <Icon className="h-10 w-10 text-white" />
    </div>
  </div>
);

const StepCard = ({
  number,
  title,
  description,
  icon,
}: {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
}) => (
  <div className="relative flex flex-col items-center text-center">
    <StepIcon icon={icon} />
    <h3 className="text-lg font-bold text-primary font-headline">{title}</h3>
    <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background font-bold text-primary">
      {number}
    </div>
  </div>
);

const DoubleStepComponent = ({
  number,
  options,
}: {
  number: number;
  options: [DoubleStepOption, DoubleStepOption];
}) => {
  const t = useTranslations();
  
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="flex items-start justify-center gap-8">
        <div>
          <StepIcon icon={options[0].icon} />
          <h3 className="text-lg font-bold text-primary font-headline">
            {options[0].title}
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {options[0].description}
          </p>
        </div>
        <span className="text-muted-foreground font-bold mt-10">{t('common.or')}</span>
        <div>
          <StepIcon icon={options[1].icon} />
          <h3 className="text-lg font-bold text-primary font-headline">
            {options[1].title}
          </h3>
          {options[1].link ? (
            <Link
              href={options[1].link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="text-muted-foreground mt-1 hover:text-primary transition-colors text-sm">
                {options[1].description}
              </p>
            </Link>
          ) : (
            <p className="text-muted-foreground mt-1 text-sm">
              {options[1].description}
            </p>
          )}
        </div>
      </div>
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background font-bold text-primary">
        {number}
      </div>
    </div>
  );
};

export const BookingGuide = () => {
  const t = useTranslations();
  
  // Use useMemo to recreate steps when translations change
  const steps: Step[] = useMemo(() => [
    {
      icon: MapPin,
      title: t('bookingGuide.chooseVenue'),
      description: t('bookingGuide.chooseVenueDesc'),
    },
    {
      isDouble: true,
      options: [
        {
          icon: Phone,
          title: t('bookingGuide.bookByPhone'),
          description: "+65 8280 8072",
        },
        {
          icon: Headset,
          title: t('bookingGuide.bookOnline'),
          description: t('bookingGuide.visitWebsite'),
        },
      ],
    },
    {
      icon: Check,
      title: t('bookingGuide.confirmation'),
      description: t('bookingGuide.confirmationDesc'),
    },
    {
      icon: Sparkles,
      title: t('bookingGuide.experience'),
      description: t('bookingGuide.experienceDesc'),
    },
  ], [t]);
  
  const renderStep = (step: Step, index: number) => {
    if (step.isDouble) {
      return (
        <DoubleStepComponent
          key={index}
          number={index + 1}
          options={step.options}
        />
      );
    }
    return (
      <StepCard
        key={index}
        number={index + 1}
        title={step.title}
        description={step.description}
        icon={step.icon}
      />
    );
  };

  return (
    <section className="py-24 bg-secondary/20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 font-headline">
            {t('bookingGuide.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('bookingGuide.seeDetailedGuide')}{" "}
            <Link href="#" className="text-primary hover:underline">
              {t('common.here')}
            </Link>
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
