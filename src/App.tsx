import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Cloud – Demo React SPA (mobile-first)
 * Flujo: Mapa → Video (fragmento YouTube) → Quiz → Victoria → Fin de demo
 */

// =============== CONFIG ===============
const LESSON = {
  id: "leccion-1",
  title: "Primeras ciudades",
  // Video: https://www.youtube.com/watch?v=uZKUthKdKKY
  // Fragmento: 3:14 (194s) → 4:27 (~267s)
  videoId: "uZKUthKdKKY",
  start: 194,
  end: 267,

  // Assets (usar public/assets/*)
  heroUrl: "/assets/cloud-hero.png",
  enemyUrl: "/assets/enemy-boss.png",
  artifact: {
    name: "Espada de Madera",
    imageUrl: "/assets/sword.png", // cámbialo cuando tengas tu PNG real
    description:
      "Descripción: de las primeras fabricadas, antes de la edad de bronce.",
  },


  // Preguntas (luego las ajustamos al fragmento exacto)
  questions: [
    {
      prompt: "¿Cuándo surge Jericó, probablemente la primera ciudad de la Tierra?",
      options: [
        "Cerca del año 1000 de la era humana",
        "Cerca del año 4000 de la era humana",
        "Hace 12 000 años",
        "Cerca del año 5000 de la era humana"
      ],
      answerIndex: 0,
      hint: "El video menciona explícitamente “año 1000 de la era humana”.",
    },
    {
      prompt: "Durante ese periodo, ¿cuántos humanos había aproximadamente en el mundo?",
      options: [
        "Cerca de 5 millones",
        "50 millones",
        "500 mil",
        "500 millones"
      ],
      answerIndex: 0,
      hint: "Menos que la población actual de Londres.",
    },
    {
      prompt: "¿Qué dos logros aparecen cerca del año 5000 de la era humana?",
      options: [
        "La primera escritura y la rueda",
        "La pólvora y la imprenta",
        "La brújula y el papel",
        "El hierro y el acero"
      ],
      answerIndex: 0,
      hint: "El video los menciona como hitos casi simultáneos.",
    },
  ],

};

const NEXT_LEVEL = {
  id: "leccion-2",
  title: "Siguiente lección (Bloqueada en demo)",
};

const DUMMY_LOCKED_LESSONS = [
  { id: "l2",  title: "Mesopotamia y Antiguo Egipto",                 number: 2 },
  { id: "l3",  title: "Valle del Indo y China antigua",               number: 3 },
  { id: "l4",  title: "Edad de Bronce: metalurgia y comercio",        number: 4 },
  { id: "l5",  title: "Edad de Hierro y primeros imperios",           number: 5 },
  { id: "l6",  title: "Grecia clásica",                                number: 6 },
  { id: "l7",  title: "Roma y el Imperio",                             number: 7 },
  { id: "l8",  title: "Alta Edad Media (feudalismo)",                  number: 8 },
  { id: "l9",  title: "Baja Edad Media y la Peste Negra",              number: 9 },
  { id: "l10", title: "Renacimiento en Italia",                        number: 10 },
];

// =============== UI helpers ===============
function Card({
  children,
  className = "",
}: {
  children: any;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl shadow-xl border border-white/60 bg-white/90 backdrop-blur p-4 ${className}`}
    >
      {children}
    </div>
  );
}

type Screen = "map" | "video" | "quiz" | "victory" | "end";

// =============== APP ===============
export default function App() {
  const [screen, setScreen] = useState<Screen>("map");
  const [quizIndex, setQuizIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showFinDemo] = useState(false);

  const headerTitle: Record<Exclude<Screen, "video">, string> = {
    map: "Lecciones",
    quiz: "Desafío",
    victory: "Resultados",
    end: "Final",
  };

  const showHeader = screen !== "video";

  const startLesson = () => setScreen("video");
  const handleQuizComplete = () => setScreen("victory");
  const backToMap = () => setScreen("map");
  const tryNextLevel = () => setScreen("end");

  return (
    <div className="min-h-screen w-full bg-W text-gray-800">
      {showHeader && (
        <header className="sticky top-0 z-10 bg-white/75 border-b border-gray-200 mb-4">
          <div className="max-w-lg mx-auto px-4 py-8">
            <h1 className="text-center text-base font-semibold">
              {screen === "map"
                ? headerTitle.map
                : screen === "quiz"
                ? headerTitle.quiz
                : screen === "victory"
                ? headerTitle.victory
                : headerTitle.end}
            </h1>
          </div>
        </header>
      )}

      {screen === "video" ? (
        <VideoScreen lesson={LESSON} onFinish={() => setScreen("quiz")} />
      ) : (
        <main className="max-w-lg mx-auto px-8 py-6 space-y-5">
          {screen === "map" && (
            <MapScreen
              onStartLesson={startLesson}
              onTryNextLevel={tryNextLevel}
            />
          )}

          {screen === "quiz" && (
            <QuizScreen
              lesson={LESSON}
              onComplete={handleQuizComplete}
              quizIndex={quizIndex}
              setQuizIndex={setQuizIndex}
              correctCount={correctCount}
              setCorrectCount={setCorrectCount}
            />
          )}

          {screen === "victory" && (
            <VictoryScreen lesson={LESSON} onContinue={backToMap} />
          )}

          {screen === "end" && <EndOfDemoScreen onBack={() => setScreen("map")} />}
        </main>
      )}
    </div>
  );
}

// =============== MAPA ===============
function MapScreen({
  onStartLesson,
  onTryNextLevel,
}: {
  onStartLesson: () => void;
  onTryNextLevel: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3">
        {/* Lección 1 */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Lección 1</div>
              <div className="font-semibold">{LESSON.title}</div>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={onStartLesson}
              className="w-full px-4 py-3 rounded-xl bg-sky-600 text-white text-center font-semibold active:scale-[.99] transition"
            >
              Empezar lección
            </button>
          </div>
        </Card>

{/* Lecciones bloqueadas (solo visuales para demo) */}
{DUMMY_LOCKED_LESSONS.map((lx) => (
  <Card key={lx.id}>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">Lección {lx.number}</div>
        <div className="font-semibold">{lx.title}</div>
      </div>
    </div>
    <div className="mt-4">
      <button
        onClick={onTryNextLevel} // → muestra “Fin de la demo”
        className="w-full px-4 py-3 rounded-xl bg-gray-300 text-gray-700 font-semibold active:scale-[.99] transition"
      >
        Ver lección
      </button>
    </div>
  </Card>
))}
      </div>
    </div>
  );
}

// =============== VIDEO full-screen (autoplay + activar sonido + fin inmediato) ===============
function useIsPortrait() {
  const get = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(orientation: portrait)").matches;
  const [isPortrait, setIsPortrait] = useState<boolean>(get());

  useEffect(() => {
    const mql = window.matchMedia("(orientation: portrait)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsPortrait("matches" in e ? e.matches : (e as MediaQueryList).matches);
    try {
      mql.addEventListener("change", handler as (e: MediaQueryListEvent) => void);
    } catch {
      // @ts-ignore
      mql.addListener(handler);
    }
    return () => {
      try {
        mql.removeEventListener(
          "change",
          handler as (e: MediaQueryListEvent) => void
        );
      } catch {
        // @ts-ignore
        mql.removeListener(handler);
      }
    };
  }, []);

  return isPortrait;
}

function VideoScreen({
  lesson,
  onFinish,
}: {
  lesson: typeof LESSON;
  onFinish: () => void;
}) {
  const isPortrait = useIsPortrait();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  // Fallback: por si el evento 'ended' no llega exacto
  const duration = Math.max(1, lesson.end - lesson.start);

  const embedUrl = useMemo(() => {
    const params = new URLSearchParams({
      start: String(lesson.start),
      end: String(lesson.end),
      autoplay: "1",
      mute: soundOn ? "0" : "1",
      controls: "0",
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
      fs: "0",
      enablejsapi: "1",
      origin: window.location.origin,
    });
    return `https://www.youtube-nocookie.com/embed/${lesson.videoId}?${params.toString()}`;
  }, [lesson.videoId, lesson.start, lesson.end, soundOn]);

  // Handshake + suscripción a onStateChange (ended=0)
  useEffect(() => {
    const w = iframeRef.current?.contentWindow;
    if (!w) return;
    w.postMessage(JSON.stringify({ event: "listening", id: 1 }), "*");
    w.postMessage(
      JSON.stringify({
        event: "command",
        func: "addEventListener",
        args: ["onStateChange"],
      }),
      "*"
    );
  }, [embedUrl]);

  // Escucha eventos del IFrame API para detectar final inmediatamente
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (typeof e.data !== "string") return;
      try {
        const data = JSON.parse(e.data);
        // playerState: 0 => ended
        if (
          (data?.event === "onStateChange" && data?.info === 0) ||
          (data?.info && typeof data.info.playerState === "number" && data.info.playerState === 0)
        ) {
          onFinish();
        }
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [onFinish]);

  // Fallback timer con pequeño margen negativo para evitar “espera”
  useEffect(() => {
    const t = window.setTimeout(onFinish, Math.max(500, (duration - 0.5) * 1000));
    return () => window.clearTimeout(t);
  }, [duration, onFinish, embedUrl]);

  // Activar sonido por gesto del usuario (recomendado en iOS)
    const enableSound = () => {
    setSoundOn(true);
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "unMute", args: [] }),
        "*"
      );
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "setVolume", args: [100] }),
        "*"
      );
    } catch {
      /* ignore */
    }
  };

  // NUEVO: omitir video (pausa + finalizar)
  const skipVideo = () => {
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
        "*"
      );
    } catch {
      /* ignore */
    }
    onFinish();
  };

  return (
    <div className="fixed inset-0 bg-black">
      <iframe
        ref={iframeRef}
        className="w-screen h-dvh"
        src={embedUrl}
        title="Video lección"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        frameBorder={0}
      />

      {/* Overlay de rotación cuando está en portrait */}
      {isPortrait && (
        <div className="pointer-events-none absolute inset-0 bg-black/50 text-white grid place-items-center px-8 text-center">
          <div className="space-y-3">
            <div className="text-5xl">🔄</div>
            <div className="text-lg font-semibold">Gira tu teléfono</div>
            <div className="text-sm text-white/90">
              Al finalizar, pasarás al desafío automáticamente.
            </div>
          </div>
        </div>
      )}

      {/* NUEVO: Botón Omitir video (arriba-derecha, con safe-area) */}
      <div
        className="absolute"
        style={{
          top: "max(1rem, env(safe-area-inset-top))",
          right: "max(1rem, env(safe-area-inset-right))",
          zIndex: 10,
        }}
      >
        <button
          onClick={skipVideo}
          className="px-4 py-2 rounded-xl bg-white/90 text-black font-semibold shadow"
          aria-label="Omitir video"
        >
          Omitir video
        </button>
      </div>

      {/* Botón para activar sonido (abajo-derecha) */}
      {!soundOn && (
        <div className="absolute bottom-4 right-4" style={{ right: "max(1rem, env(safe-area-inset-right))", bottom: "max(1rem, env(safe-area-inset-bottom))", zIndex: 10 }}>
          <button
            onClick={enableSound}
            className="px-4 py-2 rounded-xl bg-white/90 text-black font-semibold shadow"
          >
            Activar sonido
          </button>
        </div>
      )}
    </div>
  );
}

// =============== QUIZ (seleccionar → Probar → feedback → Siguiente/Retry) ===============
function QuizScreen({
  lesson,
  onComplete,
  quizIndex,
  setQuizIndex,
  correctCount,
  setCorrectCount,
}: {
  lesson: typeof LESSON;
  onComplete: () => void;
  quizIndex: number;
  setQuizIndex: (n: number) => void;
  correctCount: number;
  setCorrectCount: (n: number) => void;
}) {
  const q = lesson.questions[quizIndex];

  // Estados
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  // Personajes
  const hero = lesson.heroUrl ? (
    <img src={lesson.heroUrl} alt="hero" className="h-32 object-contain" />
  ) : (
    <div className="h-32 w-32 grid place-items-center text-5xl">☁️</div>
  );
  const enemy = lesson.enemyUrl ? (
    <img src={lesson.enemyUrl} alt="enemy" className="h-32 object-contain" />
  ) : (
    <div className="h-32 w-32 grid place-items-center text-5xl">👹</div>
  );

  // Lógica: seleccionar no califica
  const onChoose = (idx: number) => {
    if (status !== "idle") return;
    setSelected(idx);
  };

  // Calificar con CTA
  const checkAnswer = () => {
    if (selected === null) return;
    const isCorrect = selected === q.answerIndex;
    setStatus(isCorrect ? "correct" : "wrong");
    if (isCorrect) setCorrectCount(correctCount + 1);
  };

  // Siguiente o reintentar
  const next = () => {
    if (quizIndex < lesson.questions.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelected(null);
      setStatus("idle");
    } else {
      onComplete();
    }
  };

  const retry = () => {
    setStatus("idle");
    setSelected(null);
  };

  const progressPct = Math.round(((quizIndex + 1) / lesson.questions.length) * 100);

  return (
    <div className="space-y-5 pb-24">
      {/* Progreso */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-sky-500 rounded-full" style={{ width: `${progressPct}%` }} />
      </div>

      {/* VS */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1 grid place-items-center">{hero}</div>
        <div className="text-xl font-semibold text-gray-500">VS</div>
        <div className="flex-1 grid place-items-center">{enemy}</div>
      </div>

      {/* Pregunta */}
      <div className="text-base font-semibold">{q.prompt}</div>

     {/* Opciones */}
<div className="grid grid-cols-1 gap-3">
  {q.options.map((opt, idx) => {
    const isSelected = selected === idx;

    let cls = "bg-white";
    let textCls = "text-gray-500";

    if (status === "idle") {
      if (isSelected) {
        cls = "bg-sky-50 border-sky-400 ring-2 ring-sky-200";
        textCls = "text-sky-700";
      } else {
        cls = "bg-white hover:bg-gray-50";
      }
    } else if (status === "correct") {
      // Cuando acierta: resalta la elegida en verde
      if (isSelected) {
        cls = "bg-green-100 border-green-500";
        textCls = "text-green-800";
      }
    } else if (status === "wrong") {
      // Cuando falla: SOLO resalta la elegida en rojo (no mostramos la correcta)
      if (isSelected) {
        cls = "bg-red-100 border-red-500";
        textCls = "text-red-800";
      }
    }

    return (
      <button
        key={idx}
        onClick={() => onChoose(idx)}
        disabled={status !== "idle"}
        className={`text-left border rounded-xl px-4 py-3 transition ${cls} ${textCls}`}
      >
        {opt}
      </button>
    );
  })}
</div>

{/* Feedback tipo Duolingo */}
{status !== "idle" && (
  <div
    className={`mt-3 rounded-xl border px-4 py-3 text-sm ${
      status === "correct"
        ? "bg-green-50 border-green-500 text-green-800"
        : "bg-red-50 border-red-500 text-red-800"
    }`}
  >
    {status === "correct" ? (
      "Correcto"
    ) : (
      <div>
        <div>Incorrecto</div>
        {q.hint && <div className="text-xs mt-1 opacity-90">Pista: {q.hint}</div>}
      </div>
    )}
  </div>
)}


      {/* CTA fija inferior */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-lg px-6">
          {status === "idle" && (
            <button
              onClick={checkAnswer}
              disabled={selected === null}
              className={`w-full px-4 py-3 rounded-xl font-semibold text-white transition ${
                selected === null ? "bg-gray-300" : "bg-sky-600 active:scale-[.99]"
              }`}
            >
              Probar respuesta
            </button>
          )}

          {status === "correct" && (
            <button
              onClick={next}
              className="w-full px-4 py-3 rounded-xl font-semibold text-white bg-sky-600 active:scale-[.99]"
            >
              Siguiente
            </button>
          )}

          {status === "wrong" && (
            <button
              onClick={retry}
              className="w-full px-4 py-3 rounded-xl font-semibold text-white bg-gray-800 active:scale-[.99]"
            >
              Intentar de nuevo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
// =============== VICTORIA ===============
function VictoryScreen({
  lesson,
  onContinue,
}: {
  lesson: typeof LESSON;
  onContinue: () => void;
}) {
  return (
    <div className="pb-24">
      {/* Contenido centrado en la pantalla */}
      <div className="min-h-[calc(100dvh-11rem)] flex flex-col items-center justify-center text-center px-6">
        <div className="text-sm text-gray-600">Has ganado un artefacto histórico</div>
        <div className="text-xs text-gray-500">Lección: {lesson.title}</div>

        {/* Artefacto sin borde ni fondo, solo sombra */}
        <div className="mt-4">
          {lesson.artifact.imageUrl ? (
            <img
              src={lesson.artifact.imageUrl}
              alt="Artefacto histórico"
              className="w-32 h-32 md:w-36 md:h-36 object-contain mb-2 mt-2"
            />
          ) : (
            <span className="text-5xl">🏺</span>
          )}
        </div>

        <div className="text-base font-semibold mt-3">{lesson.artifact.name}</div>
        <div className="text-xs text-gray-500 mt-1">
          {("description" in lesson.artifact && (lesson.artifact as any).description) ||
            "Se añadió a tu colección."}
        </div>
      </div>

      {/* CTA fija inferior */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center px-6">
        <button
          onClick={onContinue}
          className="w-full max-w-lg px-4 py-3 rounded-xl bg-sky-600 text-white font-semibold active:scale-[.99] transition"
        >
          Volver a lecciones
        </button>
      </div>
    </div>
  );
}

// =============== FIN DE DEMO ===============
function EndOfDemoScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="pb-24">
      <div className="max-w-lg mx-auto space-y-3 text-center px-6">
        <p className="text-sm">
          Gracias por jugar. Esta es una demo temprana de <strong>Cloud</strong>, una experiencia de Historia con lecciones cortas y desafíos.
          Si te gustó, pronto liberaremos más niveles. ¡Mantente atento!
        </p>
      </div>

      {/* CTA fija inferior */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center px-6">
        <button
          onClick={onBack}
          className="w-full max-w-lg px-4 py-3 rounded-xl bg-sky-600 text-white font-semibold active:scale-[.99] transition"
        >
          Volver a lecciones
        </button>
      </div>
    </div>
  );
}
