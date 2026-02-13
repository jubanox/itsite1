import { useEffect, useState, ReactNode } from "react";

const isMobileDevice = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();
  return /mobile|iphone|ipod|android.*mobile|windows phone|blackberry|opera mini|iemobile/i.test(ua);
};

interface MobileGuardProps {
  children: ReactNode;
}

const MobileGuard = ({ children }: MobileGuardProps) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isMobileDevice()) {
      window.location.href = "https://www.google.com";
      return;
    }
    setChecked(true);
  }, []);

  if (!checked) return null;

  return <>{children}</>;
};

export default MobileGuard;
