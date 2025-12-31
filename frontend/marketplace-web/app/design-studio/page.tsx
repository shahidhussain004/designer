import { ContactSection } from "@/app/design-studio/contact-section";
import { HeroSection } from "@/app/design-studio/hero-section";
import { PhilosophySection } from "@/app/design-studio/philosophy-section";
import { ServicesSection } from "@/app/design-studio/services-section";
import { TestimonialsSection } from "@/app/design-studio/testimonials-section";
import { WorkShowcase } from "@/app/design-studio/work-showcase";
import { PageLayout } from '@/components/ui';

export default function ContactPage() {
  return (
    <PageLayout>
      <HeroSection />
      <ServicesSection />
      <WorkShowcase />
      <PhilosophySection />
      <TestimonialsSection />
      <ContactSection />
    </PageLayout>
  )
}
