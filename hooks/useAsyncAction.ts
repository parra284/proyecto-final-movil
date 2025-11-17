import { useState } from "react";

export function useAsyncAction() {
  const [loading, setLoading] = useState(false);

  const run = async (action: () => Promise<any>) => {
    try {
      setLoading(true);
      await action();
    } catch (err: any) {
      return Promise.reject(err); 
    } finally {
      setLoading(false);
    }
  };

  return { loading, run };
}
