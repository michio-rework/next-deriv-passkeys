import { useAppStore } from "../store";
import { useRouter } from "next/router";
import { ComponentType } from "react";

export function withAuth<T extends object>(WrappedComponent: ComponentType<T>) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  const Auth = (props: T) => {
    const store = useAppStore();
    const router = useRouter();

    if (store.accessToken) {
      return <WrappedComponent {...(props as T)} />;
    } else {
      router.replace("/");
      return null;
    }
  };

  Auth.displayName = `withTheme(${displayName})`;

  return Auth;
}

export default withAuth;
