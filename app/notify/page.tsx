import Link from "next/link";
import EmailSignupForm from "../components/EmailSignupForm";

export default function NotifyPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "440px",
          width: "100%",
          background: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "10px",
          padding: "40px 32px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "26px",
            fontWeight: 800,
            marginBottom: "10px",
          }}
        >
          Get Notified at Launch
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "28px", fontSize: "15px" }}>
          Enter your email and we&apos;ll let you know the moment PoloForge
          opens.
        </p>

        <EmailSignupForm source="PoloForgeInterest" buttonLabel="Notify Me" />

        <Link
          href="/"
          style={{
            display: "inline-block",
            marginTop: "24px",
            color: "#64748b",
            fontSize: "13px",
            textDecoration: "underline",
          }}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}