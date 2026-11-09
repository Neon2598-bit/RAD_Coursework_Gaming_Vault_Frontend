import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) return error.response.data.message as string;
    if (!error.response) return "Cannot reach the server. Please try again.";
  }
  return error instanceof Error ? error.message : "Something went wrong";
};
