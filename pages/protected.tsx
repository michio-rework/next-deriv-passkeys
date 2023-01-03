import axios from "axios";
import { useEffect, useState } from "react";
import { useAppStore } from "store";
import useSWR from "swr";

export default function Home() {
  const store = useAppStore();
  const [secret, setSecret] = useState(null);
  const [isError, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetcher = async () => {
    return await axios.get("/api/protectedRoute", {
      headers: {
        authorization: `Bearer ${store.accessToken}`,
      },
    });
  };

  const { data, error } = useSWR("/api/", fetcher);

  useEffect(() => {
    if (data) setSecret(data.data);
    if (error) setError(error);
    setLoading(false);
  }, [data, error]);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    if (isError) {
      return <div>YO! YOU ARE NOT AUTHENTICATED,GET AWAY FROM HERE!!!</div>;
    } else {
      return <div>Welcome to protected Page, {secret}</div>;
    }
  }
}
