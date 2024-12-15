import dayjs from "dayjs";

export const isExpired = (expiresIn: number): boolean => {
  return dayjs().isAfter(dayjs.unix(expiresIn));
};
