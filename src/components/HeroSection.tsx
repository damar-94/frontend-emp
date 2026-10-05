import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronRight } from "lucide-react";

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  imageUrl: string;
  link: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: "banner-1",
    title: "Boyz II Men + Dewa 19",
    subtitle: "Live in Jakarta • 9 December 2026 • Indonesia Arena",
    tagline: "Saksikan Perpaduan Musisi Legendaris",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80",
    link: "/events/boyz-ii-men-dewa-19",
  },
  {
    id: "banner-2",
    title: "Jakarta Indie Music Fest 2026",
    subtitle: "Gelora Bung Karno • 14 November 2026",
    tagline: "Presale 2 Tersedia Sekarang",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80",
    link: "/events/jakarta-indie-music-fest",
  },
  {
    id: "banner-3",
    title: "Orchestra of the Archipelago",
    subtitle: "Teater Jakarta • 18 December 2026",
    tagline: "Konser Simfoni Akhir Tahun Terbesar",
    imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1600&q=80",
    link: "/events/nusantara-symphony",
  },
];

export function HeroSection() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
        }}
        className="relative w-full overflow-hidden rounded-2xl shadow-xl group"
      >
        <CarouselContent className="-ml-0">
          {BANNER_SLIDES.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0 relative">
              <a
                href={slide.link}
                className="relative block w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/8] max-h-[380px] overflow-hidden bg-slate-950"
              >
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between">
                  <div className="max-w-xl">
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                      {slide.title}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
                      {slide.subtitle}
                    </p>
                  </div>

                  <div className="self-start">
                    <div className="inline-flex items-center gap-2 bg-white/95 hover:bg-white text-slate-900 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-md backdrop-blur transition-all">
                      <span>{slide.tagline}</span>
                      <span className="text-blue-600 font-bold inline-flex items-center hover:underline">
                        Beli Tiketnya di Sini
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/90 hover:bg-white text-slate-800 border-none shadow-md z-10" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/90 hover:bg-white text-slate-800 border-none shadow-md z-10" />

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-1.5 rounded-full transition-all ${
                current === index
                  ? "w-6 bg-white shadow"
                  : "w-1.5 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}