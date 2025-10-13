"use client";

import CookieConsent from "react-cookie-consent";

const CookieBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="I understand"
      cookieName="brianMainaPortfolioCookieConsent"
      style={{ background: "#2B373B", fontSize: "14px" }}
      buttonStyle={{
        background: "#F0F0F0",
        color: "#333",
        fontSize: "13px",
        borderRadius: "8px",
        padding: "8px 16px"
      }}
      expires={150}
    >
      This website uses cookies from third-party services to enhance the user experience. By continuing to use this site, you consent to this practice.
    </CookieConsent>
  );
};

export default CookieBanner;
