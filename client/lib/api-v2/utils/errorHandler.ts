import { AxiosError } from "axios";
import { ApiError } from "../types/ApiError";

export const handleAxiosError = (error: AxiosError | any): Promise<never> => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const apiError = new ApiError(
      error.response.status,
      error.response.statusText,
      error.response.data
    );
    return Promise.reject(apiError);
  } else if (error.request) {
    // The request was made but no response was received
    return Promise.reject(new Error("No response received from server"));
  } else {
    // Something happened in setting up the request that triggered an Error
    return Promise.reject(error);
  }
};
