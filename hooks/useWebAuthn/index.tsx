import {
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill,
} from "@simplewebauthn/browser";
import { useCallback, useEffect, useState } from "react";

const useWebAuthn = () => {
  const [hasWebAuthnSupport, setHasWebAuthnSupport] = useState<boolean>(false);
  const [hasWebAuthnAutofill, setHasWebAuthnAutofill] =
    useState<boolean>(false);

  const checkAutofillSupport = useCallback(async () => {
    try {
      const supportsAutofill = await browserSupportsWebAuthnAutofill();
      setHasWebAuthnAutofill(supportsAutofill);
    } catch (error) {
      console.error("not auto fill support");
    }
  }, []);

  useEffect(() => {
    try {
      const supportsWebAuthn = browserSupportsWebAuthn();
      setHasWebAuthnSupport(supportsWebAuthn);
      checkAutofillSupport();
    } catch (error) {
      console.error("not webauthn support");
    }
  }, [checkAutofillSupport]);

  return { hasWebAuthnSupport, hasWebAuthnAutofill };
};

export default useWebAuthn;
