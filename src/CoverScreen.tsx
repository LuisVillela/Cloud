import React from "react";

export default function CoverScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-300 to-blue-600 text-white">
      <img
        src="assets/cloud-hero.png"
        alt="Cloud"
        className="w-40 mb-6 animate-bounce"
      />
      <h1 className="text-3xl font-bold mb-4">¡Bienvenido a Cloud!</h1>
      <p className="text-lg mb-6 text-center px-4">
        Acompáñame a recorrer la historia y vencer a los enemigos.
      </p>
      <button
        onClick={onStart}
        className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl shadow hover:scale-105 transition"
      >
        Comenzar
      </button>
    </div>
  );
}
