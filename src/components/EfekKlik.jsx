import { useEffect } from "react";

// Memunculkan riak kecil di titik mana pun yang diklik atau disentuh.
export default function EfekKlik() {
  useEffect(() => {
    const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)");

    function saatKlik(e) {
      if (kurangiGerak.matches) return;
      const riak = document.createElement("span");
      riak.className = "klik-riak";
      riak.style.left = `${e.clientX}px`;
      riak.style.top = `${e.clientY}px`;
      document.body.appendChild(riak);
      riak.addEventListener("animationend", () => riak.remove(), { once: true });
    }

    document.addEventListener("pointerdown", saatKlik, { passive: true });
    return () => document.removeEventListener("pointerdown", saatKlik);
  }, []);

  return null;
}