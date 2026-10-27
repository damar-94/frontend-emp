import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { Review } from "@/pages/dashboards/event-organizer/EventOrganizerReviews";
import type { PaginationMeta } from "@/types/pagination.types";

export interface OrganizerReviewsQueryParams {
  page: number;
  take: number;
  search?: string;
  event?: string;
  rating?: string;
}

export interface OrganizerReviewsResponseData {
  averageRating: number;
  totalReviews: number;
  events: string[];
  reviews: Review[];
  meta: PaginationMeta;
}

export const useOrganizerReviewsQuery = (
  filters: OrganizerReviewsQueryParams,
) => {
  return useQuery<OrganizerReviewsResponseData>({
    queryKey: ["organizer-reviews", filters],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page: filters.page,
        take: filters.take,
      };

      if (filters.search && filters.search.trim() !== "") {
        params.search = filters.search.trim();
      }
      if (filters.event && filters.event !== "ALL") {
        params.event = filters.event;
      }
      if (filters.rating && filters.rating !== "ALL") {
        params.rating = filters.rating;
      }

      const res = await axiosInstance.get<{
        success: boolean;
        data: OrganizerReviewsResponseData;
      }>("/reviews/organizer", { params });

      return res.data.data;
    },
    placeholderData: keepPreviousData,
  });
};