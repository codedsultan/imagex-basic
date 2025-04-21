import axios from 'axios';

export interface MockupPayload {
  design_id: number;
  product_id: number;
  template_id: string;
  name: string;
  json_data: string;
  front_image: string;
  print_areas: any;
  mockupId?: string;
}

/**
 * Build the body object for saving/updating a mockup
 */
export function buildMockupPayload(
  params: Omit<MockupPayload,'mockupId'> & { mockupId?: string }
): MockupPayload {
  return { ...params };
}

/**
 * Save or update a mockup via axios
 */
export async function saveMockup(
  id: string | null,
  payload: MockupPayload
): Promise<any> {
  if (id) {
    return axios.put(`/mockups/${id}`, payload);
  } else {
    return axios.post(`/mockups`, payload);
  }
}
