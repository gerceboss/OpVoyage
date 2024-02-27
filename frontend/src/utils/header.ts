import { ServerResponse } from "http";

export const setCacheHeader = (res: ServerResponse, duration: number) => {
  res.setHeader("Cache-Control", `public, s-maxage=${duration}`);
  res.setHeader("CDN-Cache-Control", `public, s-maxage=${duration}`);
  res.setHeader("Vercel-CDN-Cache-Control", `public, s-maxage=${duration}`);
  return res;
};
