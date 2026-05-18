import { useCallback, useEffect, useState } from "react";

const useMarketplaceCollection = (getter) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setItems(getter());
    setLoading(false);
  }, [getter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, refresh, setItems };
};

export default useMarketplaceCollection;
