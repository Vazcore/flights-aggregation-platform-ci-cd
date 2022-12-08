import uuid from "uuidv4";

export enum AUTH_STATUS {
  AUTH = "authenticated",
}
export const isAuth = (status: string) => {
  return status === AUTH_STATUS.AUTH;
};

export const generateId = (): number => {
  return uuid().split("").reduce((acc, curr) => acc + curr.charCodeAt(0), 0);
};

