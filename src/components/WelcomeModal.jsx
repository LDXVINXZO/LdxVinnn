import React, { useState } from "react";
import "../styles/welcome-modal.css";

export function WelcomeModal() {
  // Selalu tampil tiap kali komponen ini mount (tiap kunjungan/refresh),
  // tidak lagi disimpan ke localStorage.
  const [isOpen, setIsOpen] = useState(true);

  const close = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="welcome-modal">
      <div className="welcome-modal__backdrop" onClick={close} />
      <div className="welcome-modal__card" role="dialog" aria-modal="true" aria-labelledby="welcome-modal-title">
        <button className="welcome-modal__close" onClick={close} aria-label="Tutup">
          <CloseGlyph />
        </button>

        <div className="welcome-modal__art">
          <img src="/logo.svg" alt="" className="welcome-modal__logo" />
        </div>

        <h1 id="welcome-modal-title" className="welcome-modal__title">
          Selamat datang di LdxVin
        </h1>
        <p className="welcome-modal__desc">
          Isi sendiri! file /src/components/WelcomeModal.jsx line 43
        </p>

        <button className="welcome-modal__cta" onClick={close}>
          Mulai Dengarkan
        </button>
      </div>
    </div>
  );
}

function CloseGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
