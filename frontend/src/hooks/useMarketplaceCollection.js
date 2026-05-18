import { useEffect, useState } from "react";

const useMarketplaceCollection = (getter) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setItems(getter());
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { items, loading, refresh, setItems };
};

export default useMarketplaceCollection;
