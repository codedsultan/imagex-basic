import { MockupLayer } from "./mockup";

export interface Design {
    id: number;
    title: string;
    thumbnail: string;
    image_path: string;
    preview_url: string;
    layers: MockupLayer[];
    full_image_url: string;
}

// interface Design {
//     id: number;
//     title: string;
//     thumbnail: string;
//     image_path: string;
//     preview_url: string;
// }
