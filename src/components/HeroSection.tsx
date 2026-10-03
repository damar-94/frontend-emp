import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function HeroSection() {
  return (
    <Carousel className="container mx-auto h-[800px] w-full max-w-7xl bg-amber-400 border">
      <CarouselContent className="h-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="h-full p-0">
            <Card className="h-full rounded-none bg-red-400">
              <CardContent className="flex h-full items-center justify-center p-6">
                <span className="text-4xl font-semibold">
                  {index + 1}
                </span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}