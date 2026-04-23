
export type Url = {
  id?: string;
  longUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
  userId: string | null;
};
