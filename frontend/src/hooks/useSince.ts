import { MomentInput } from "moment";
import moment from "@/constants/moment";
import { useEffect, useState } from "react";

export const useSince = (inp?: MomentInput) => {
  const calculateSince = () => moment(inp).fromNow();

  const [since, setSince] = useState(calculateSince());

  useEffect(() => {
    const interval = setInterval(() => {
      setSince(calculateSince());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return since;
};
