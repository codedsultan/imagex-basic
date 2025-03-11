import { z } from 'zod';

type ApplicationStatus = 'new' | 'reviewed' | 'rejected' | 'shortlisted' | 'interviewed' | string;

type ApplicationTag =
  | 'invited'
  | 'keep in view'
  | 'email sent'
  | 'selected'
  | 'not qualified'
  | 'considering'
  | 'email not sent';

type InterviewStatus = 'booked' | string;

const JobStatusSchema = z.enum(['live', 'draft', 'paused', 'expired', 'closed']);

type JobStatus = z.infer<typeof JobStatusSchema>;

export const getLabelColor = (label: ApplicationStatus | ApplicationTag | InterviewStatus) => {
  switch (true) {
    case ['rejected', 'not qualified', 'email not sent'].includes(label?.toLowerCase()): {
      return {
        color: 'text-red-600',
        backgroundColor: 'bg-red-100',
        dot: 'bg-red-600',
      };
    }
    case ['new', 'invited'].includes(label?.toLowerCase()): {
      return {
        color: 'text-blue-600',
        backgroundColor: 'bg-blue-100',
        dot: 'bg-blue-600',
      };
    }
    case ['accepted', 'offered', 'shortlisted', 'email sent', 'selected', 'hired'].includes(
      label?.toLowerCase()
    ): {
      return {
        color: ' text-green-600',
        backgroundColor: 'bg-green-100',
        dot: 'bg-green-600',
      };
    }
    case ['assessment'].includes(label?.toLowerCase()): {
      return {
        color: 'text-yellow-500',
        backgroundColor: 'bg-yellow-100',
        dot: 'bg-yellow-500',
      };
    }
    case ['applied', 'pending review'].includes(label?.toLowerCase()): {
      return {
        color: 'text-gray-600',
        backgroundColor: 'bg-gray-100',
        dot: 'bg-gray-600',
      };
    }
    case ['reviewed', 'keep in view', 'interviews', 'booked'].includes(label?.toLowerCase()): {
      return {
        color: 'text-orange-600',
        backgroundColor: 'bg-orange-100',
        dot: 'bg-orange-600',
      };
    }
    default: {
      return {
        color: 'text-pink-600',
        backgroundColor: 'bg-pink-100',
        dot: 'bg-pink-600',
      };
    }
  }
};

export const getJobStatusColor = (status: JobStatus) => {
  return {
    live: { bg: 'bg-green-50', dot: 'bg-green-600', text: 'text-green-600' },
    closed: { bg: 'bg-red-50', dot: 'bg-red-600', text: 'text-red-600' },
    paused: { bg: 'bg-yellow-50', dot: 'bg-yellow-600', text: 'text-yellow-600' },
    draft: { bg: 'bg-gray-50', dot: 'bg-gray-600', text: 'text-gray-600' },
    expired: { bg: 'bg-orange-50', dot: 'bg-orange-600', text: 'text-orange-600' },
  }[status];
};
