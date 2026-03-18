"use client";

import CookieConsent from "react-cookie-consent";
import Link from "next/link";

const CookieBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="I understand"
      enableDeclineButton
      declineButtonText="Decline Non-Essential Cookies"
      cookieName="brianMainaPortfolioCookieConsent"
      style={{ background: "#2B373B", fontSize: "14px", alignItems: "center" }}
      buttonStyle={{
        background: "#F0F0F0",
        color: "#333",
        fontSize: "13px",
        borderRadius: "8px",
        padding: "8px 16px"
      }}
      declineButtonStyle={{
        background: "transparent",
        border: "1px solid #F0F0F0",
        color: "#F0F0F0",
        fontSize: "13px",
        borderRadius: "8px",
        padding: "8px 16px"
      }}
      expires={150}
    >
      This website uses cookies to enhance the user experience. You can choose to accept or decline non-essential cookies. For more details on the data we store, please read our{" "}
      <Link href="/privacy" className="underline text-teal-400 hover:text-teal-300">
        Privacy Policy
      </Link>.
    </CookieConsent>
  );
};

export default CookieBanner;