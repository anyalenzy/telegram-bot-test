export type Constants = {
  [key: string]: [string, string][];
};

export interface UserData {
  [userId: number]: {
    username?: string;
    objectType?: "house" | "apartment";
    area?: string;
    location?: string;
    district?: string;
    works?: string[];
  };
}
