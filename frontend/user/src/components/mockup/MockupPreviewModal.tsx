import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { ImageIcon } from "lucide-react";
  import { Mockup } from "@/types";
  import { formatDate } from "@/utils/dateFormatter";

  interface MockupPreviewModalProps {
    mockup: Mockup;
    trigger?: React.ReactNode;
  }

  export default function MockupPreviewModal({ mockup, trigger }: MockupPreviewModalProps) {
    // Later we can support multiple images if needed (e.g. mockup.gallery: string[])
    const images = [mockup.thumbnail]; // expandable
    const hasImage = images && images[0];

    return (
      <Dialog>
        <DialogTrigger asChild>
          {trigger ?? (
            <Button variant="outline" size="sm">
              Preview
            </Button>
          )}
        </DialogTrigger>

        <DialogContent
          className="sm:max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          style={{ paddingBottom: "2rem" }}
        >
          <DialogHeader>
            <DialogTitle>{mockup.name}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-4">
            {/* 🖼️ Image Display or Placeholder */}
            {hasImage ? (
              <img
                src={images[0]}
                alt={mockup.name}
                className="w-full max-w-lg rounded-lg border shadow-md transition hover:shadow-lg object-contain"
              />
            ) : (
              <div className="flex w-full max-w-lg h-64 items-center justify-center rounded-md bg-muted text-gray-400 border">
                <ImageIcon className="w-12 h-12" />
              </div>
            )}

            {/* 🔖 Details */}
            <div className="text-sm text-muted-foreground text-center space-y-1">
              <p>
                <span className="font-medium">Type:</span> { "T-Shirt"}
              </p>
              <p>
                <span className="font-medium">Last updated:</span> {formatDate(mockup.updated_at)}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className="capitalize">{mockup.status ?? "draft"}</span>
              </p>
            </div>

            {/* 🔘 Extra CTA (Optional: Download, Open, etc.) */}
            {/* <Button variant="secondary">Download</Button> */}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
