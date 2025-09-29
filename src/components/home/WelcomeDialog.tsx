'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Music, PartyPopper } from 'lucide-react';
import Image from 'next/image';
import { getImage } from '@/lib/placeholder-images';

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WelcomeDialog = ({ open, onOpenChange }: WelcomeDialogProps) => {
  const welcomeImage = getImage('hero-banner');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden card-elevated">
        <div className="relative h-48">
          {welcomeImage && (
            <Image
              src={welcomeImage.imageUrl}
              alt="Welcome to NightLife"
              fill
              className="object-cover"
              data-ai-hint={welcomeImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/50 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <div className="flex items-center space-x-2 mb-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Music className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl gradient-text">NightLife</span>
            </div>
          </div>
        </div>
        <DialogHeader className="px-6 pt-4 pb-2">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <PartyPopper className="h-6 w-6 text-accent" />
            Welcome!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            Discover and book the most vibrant entertainment venues in Southeast Asia. Special offers await you!
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 text-sm">
          <p className="font-semibold text-primary">🎉 20% off your first booking!</p>
          <p className="text-muted-foreground">Use code <b className="text-foreground">NIGHTLIFE20</b> at checkout.</p>
        </div>
        <DialogFooter className="p-6 bg-secondary/30">
          <Button
            variant="neon"
            size="lg"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Discover Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
