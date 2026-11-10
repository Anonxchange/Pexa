import { useState } from "react";
import { Link } from "wouter";

/**
 * Modern floating help FAB.
 *
 * Design language: clean elevation, quality SVG, spring pill-expand on hover.
 * No pulse rings, no glows, no notification badges — just a confident button.
 */
export const FloatingChatButton = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{`
        @keyframes fcb-in {
          from { opacity: 0; transform: translateY(12px) scale(.92); }
          to   { opacity: 1; transform: translateY(0)   scale(1);   }
        }
        .fcb-root {
          animation: fcb-in .4s cubic-bezier(.16,1,.3,1) both;
        }

        @keyframes fcb-label-slide {
          from { opacity: 0; max-width: 0; margin-left: 0; }
          to   { opacity: 1; max-width: 120px; margin-left: 10px; }
        }
        .fcb-label {
          animation: fcb-label-slide .22s cubic-bezier(.16,1,.3,1) forwards;
          overflow: hidden;
          white-space: nowrap;
          display: inline-block;
        }
      `}</style>

      <div className="fcb-root fixed bottom-6 right-6 z-50">
        <Link
          href="/contact"
          aria-label="Get help from our support team"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: 52,
            minWidth: 52,
            padding: hovered ? "0 18px 0 14px" : "0",
            borderRadius: 9999,

            /* Layered shadow — subtle at rest, deeper on hover */
            boxShadow: hovered
              ? "0 1px 2px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.14), 0 12px 32px rgba(0,0,0,.18)"
              : "0 1px 2px rgba(0,0,0,.06), 0 2px 8px rgba(0,0,0,.10), 0 6px 20px rgba(0,0,0,.12)",

            /* Dark glass surface */
            background: hovered
              ? "linear-gradient(145deg, #1c1c1c 0%, #111 100%)"
              : "linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)",

            border: "1px solid rgba(255,255,255,0.09)",

            transform: hovered ? "translateY(-2px)" : "translateY(0)",
            transition:
              "transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s ease, padding .22s cubic-bezier(.16,1,.3,1), min-width .22s cubic-bezier(.16,1,.3,1), background .2s ease",

            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          {/* Icon */}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "transform .2s ease",
              transform: hovered ? "scale(1.08)" : "scale(1)",
            }}
            aria-hidden
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/*
                Refined chat bubble icon — rounded rectangle tail variant.
                Used by Intercom, Crisp, and Linear support in 2024/25.
              */}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 5.5A3.5 3.5 0 0 1 5.5 2h9A3.5 3.5 0 0 1 18 5.5v7A3.5 3.5 0 0 1 14.5 16H11l-3.2 2.4A.75.75 0 0 1 6.75 18v-2H5.5A3.5 3.5 0 0 1 2 12.5v-7Z"
                fill="white"
                opacity=".92"
              />
              {/* Three dots — typing indicator, softly offset */}
              <circle cx="7"  cy="9" r="1.1" fill="#0f0f0f" />
              <circle cx="10" cy="9" r="1.1" fill="#0f0f0f" />
              <circle cx="13" cy="9" r="1.1" fill="#0f0f0f" />
            </svg>
          </span>

          {/* Label — slides in on hover */}
          {hovered && (
            <span
              className="fcb-label"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,.9)",
                letterSpacing: "-.01em",
                fontFamily: "inherit",
              }}
            >
              Chat with us
            </span>
          )}
        </Link>
      </div>
    </>
  );
};

export default FloatingChatButton;

declare global {
  interface Window {
    Tawk_API?: {
      maximize: () => void;
      minimize: () => void;
      toggle: () => void;
      showWidget: () => void;
      hideWidget: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}
