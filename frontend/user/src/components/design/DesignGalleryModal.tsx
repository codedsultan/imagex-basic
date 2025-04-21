import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { X } from "lucide-react";
  import { useState, useEffect } from "react";
  import { Swiper, SwiperSlide } from "swiper/react";
  import { Navigation, Keyboard } from "swiper/modules";
  import "swiper/css";
  import "swiper/css/navigation";
  import "swiper/css/pagination";

  interface Design {
    id: number;
    title: string;
    full_image_url: string;
  }

  interface DesignGalleryModalProps {
    trigger: React.ReactNode;
    designs: Design[];
    initialIndex: number;
  }

  export default function DesignGalleryModal({
    trigger,
    designs,
    initialIndex,
  }: DesignGalleryModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [swiperReady, setSwiperReady] = useState(false);

    // Trigger Swiper mount after dialog opens
    useEffect(() => {
      if (isOpen) {
        const timeout = setTimeout(() => setSwiperReady(true), 50); // Wait for Dialog to open
        return () => clearTimeout(timeout);
      } else {
        setSwiperReady(false); // Reset on close
      }
    }, [isOpen]);

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>

        <DialogContent
  className="fixed inset-0 z-[9999] w-screen h-screen max-w-full max-h-screen p-0 bg-background"
>
  <DialogHeader>
    <DialogTitle className="sr-only">Design Preview</DialogTitle>
  </DialogHeader>

  <Button
    variant="ghost"
    size="icon"
    className="absolute top-4 right-4 z-50"
    onClick={() => setIsOpen(false)}
  >
    <X className="w-5 h-5" />
  </Button>

  <div className="flex flex-col h-full">
    {swiperReady && (
      <Swiper
        key={initialIndex}
        modules={[Navigation, Keyboard]}
        navigation
        keyboard
        initialSlide={initialIndex}
        slidesPerView={1}
        className="flex-1 w-full"
      >
        {designs.map((design, index) => (
          <SwiperSlide
            key={index}
            className="flex items-center justify-center p-4"
          >
            <img
              src={design.full_image_url}
              alt={design.title}
              className="max-h-[80vh] max-w-full object-contain rounded-md shadow"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    )}
  </div>
</DialogContent>


      </Dialog>
    );
  }
