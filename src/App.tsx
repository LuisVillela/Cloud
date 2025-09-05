import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Cloud – Demo React SPA (mobile-first)
 * Flujo: Mapa → Video (fragmento YouTube) → Quiz → Victoria → (volver) → Fin de demo
 * - Video: full-screen, autoplay (mute) y pasa directo a Quiz al terminar
 * - Header dinámico por pantalla (oculto en Video)
 */

// =============== CONFIG ===============
const LESSON = {
  id: "leccion-1",
  title: "La Peste Negra (siglo XIV)",
  // Video: https://www.youtube.com/watch?v=uZKUthKdKKY
  // Fragmento: 3:14 (194s) → 4:26 (~266s para asegurar corte)
  videoId: "uZKUthKdKKY",
  start: 194,
  end: 266,

  // Assets (usar public/assets/*)
  heroUrl: "/assets/cloud-hero.png",
  enemyUrl: "/assets/enemy-boss.png",
  artifact: {
    name: "Máscara de Doctor de la Peste",
    imageUrl: "/assets/plague-mask.png",
  },

  // Preguntas (luego las ajustamos al fragmento exacto)
  questions: [
    {
      prompt:
        "¿En qué continente comenzó a extenderse rápidamente la Peste Negra en el siglo XIV?",
      options: ["Europa", "Oceanía", "América", "Antártida"],
      answerIndex: 0,
      hint: "Piensa en rutas comerciales medievales.",
    },
    {
      prompt: "¿Cuál fue una consecuencia demográfica clave de la Peste Negra?",
      options: [
        "Aumento masivo de la población",
        "Disminución significativa de la población",
        "Estabilización total de la población",
        "No tuvo impacto demográfico",
      ],
      answerIndex: 1,
    },
    {
      prompt:
        "¿Qué animal suele asociarse a la transmisión de la peste en esa época?",
      options: ["Gatos", "Ratas y pulgas", "Caballos", "Aves de corral"],
      answerIndex: 1,
    },
  ],
};

const NEXT_LEVEL = {
  id: "leccion-2",
  title: "Siguiente lección (Bloqueada en demo)",
};

// =============== UI helpers ===============
function Badge({ children }: { children: any }) {
  return (
    <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
      {children}
    </span>
  );
}

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
  const [showFinDemo, setShowFinDemo] = useState(false);

  const headerTitle: Record<Exclude<Screen, "video">, string> = {
    map: "Lecciones",
    quiz: "Desafío",
    victory: "¡Lo lograste!",
    end: "Fin de la demo",
  };

  const showHeader = screen !== "video";

  const startLesson = () => setScreen("video");
  const handleQuizComplete = () => setScreen("victory");
  const backToMap = () => setScreen("map");
  const tryNextLevel = () => {
    setShowFinDemo(true);
    setScreen("end");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-sky-50 to-indigo-50 text-gray-800">
      {showHeader && (
        <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-white/60">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-sky-200 grid place-items-center text-sky-700 font-bold">
                ☁️
              </div>
              <h1 className="text-xl font-bold">
                Cloud –{" "}
                {screen === "map"
                  ? headerTitle.map
                  : screen === "quiz"
                  ? headerTitle.quiz
                  : screen === "victory"
                  ? headerTitle.victory
                  : headerTitle.end}
              </h1>
            </div>
            <Badge>Demo</Badge>
          </div>
        </header>
      )}

      {screen === "video" ? (
        <VideoScreen lesson={LESSON} onFinish={() => setScreen("quiz")} />
      ) : (
        <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
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

          {screen === "end" && <EndOfDemoScreen show={showFinDemo} />}
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
      <p className="text-sm text-gray-600">
        Haz clic en un nodo para comenzar. Esta demo contiene 1 lección jugable.
      </p>

      <div className="grid grid-cols-1 gap-3">
        {/* Nodo 1 */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 grid place-items-center text-2xl">
              🗺️
            </div>
            <div>
              <div className="font-semibold">{LESSON.title}</div>
              <div className="text-xs text-gray-500">Lección 1</div>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            <button
              onClick={onStartLesson}
              className="w-full px-4 py-3 rounded-xl bg-sky-600 text-white text-center font-semibold active:scale-[.99] transition"
            >
              Empezar lección
            </button>
            <div className="flex justify-end">
              <Badge>Desbloqueada</Badge>
            </div>
          </div>
        </Card>

        {/* Nodo 2 (demo) */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 grid place-items-center text-2xl">
              🔒
            </div>
            <div>
              <div className="font-semibold">{NEXT_LEVEL.title}</div>
              <div className="text-xs text-gray-500">Lección 2</div>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            <button
              onClick={onTryNextLevel}
              className="w-full px-4 py-3 rounded-xl bg-gray-300 text-gray-700 font-semibold active:scale-[.99] transition"
            >
              Ver lección
            </button>
            <div className="flex justify-end">
              <Badge>Bloqueada (Demo)</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// =============== VIDEO (full-screen, autoplay, overlay rotación) ===============
function useIsPortrait() {
  const get = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(orientation: portrait)").matches;

  const [isPortrait, setIsPortrait] = useState<boolean>(get());

  useEffect(() => {
    const mql = window.matchMedia("(orientation: portrait)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsPortrait("matches" in e ? e.matches : (e as MediaQueryList).matches);

    // Safari soporte legacy
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
  // Iniciamos automáticamente (no hay botón)
  const [started, setStarted] = useState(true);
  const isPortrait = useIsPortrait();
  const timerRef = useRef<number | null>(null);
  const duration = Math.max(1, lesson.end - lesson.start);

  const embedUrl = useMemo(() => {
    const params = new URLSearchParams({
      start: String(lesson.start),
      end: String(lesson.end),
      autoplay: "1",
      mute: "1", // autoplay sin bloqueo en iOS
      controls: "0",
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
      fs: "0",
    });
    return `https://www.youtube-nocookie.com/embed/${lesson.videoId}?${params.toString()}`;
  }, [lesson.videoId, lesson.start, lesson.end]);

  useEffect(() => {
    if (!started) return;
    timerRef.current = window.setTimeout(() => onFinish(), duration * 1000) as unknown as number;
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [started, duration, onFinish]);

  return (
    <div className="fixed inset-0 bg-black">
      {/* Iframe full-viewport */}
      <iframe
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
              Para ver el video, rota el dispositivo. Al finalizar, pasarás al
              desafío automáticamente.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============== QUIZ (más grande, layout suelto) ===============
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
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  const hero = lesson.heroUrl ? (
    <img src={lesson.heroUrl} alt="hero" className="h-28 object-contain" />
  ) : (
    <div className="h-28 w-28 grid place-items-center text-5xl">☁️</div>
  );
  const enemy = lesson.enemyUrl ? (
    <img src={lesson.enemyUrl} alt="enemy" className="h-28 object-contain" />
  ) : (
    <div className="h-28 w-28 grid place-items-center text-5xl">👹</div>
  );

  const onChoose = (idx: number) => {
    if (status !== "idle") return;
    setSelected(idx);
    const isCorrect = idx === q.answerIndex;
    setStatus(isCorrect ? "correct" : "wrong");
    if (isCorrect) setCorrectCount(correctCount + 1);
  };

  const next = () => {
    if (quizIndex < lesson.questions.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelected(null);
      setStatus("idle");
    } else {
      onComplete();
    }
  };

  const progressPct = Math.round(((quizIndex + 1) / lesson.questions.length) * 100);

  return (
    <div className="space-y-5">
      <Card className="p-5">
        {/* Progreso */}
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-sky-500" style={{ width: `${progressPct}%` }} />
        </div>

        {/* VS */}
        <div className="mt-5 flex items-center justify-between gap-6">
          <div className="flex-1 grid place-items-center">{hero}</div>
          <div className="text-xl font-semibold text-gray-500">VS</div>
          <div className="flex-1 grid place-items-center">{enemy}</div>
        </div>

        {/* Pregunta */}
        <div className="mt-5">
          <div className="text-base font-semibold">{q.prompt}</div>
          {q.hint && <div className="text-xs text-gray-500 mt-1">Pista: {q.hint}</div>}
        </div>

        {/* Opciones */}
        <div className="mt-4 grid grid-cols-1 gap-3">
          {q.options.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrect = idx === q.answerIndex;
            const color =
              status === "idle"
                ? "bg-white hover:bg-gray-50"
                : isSelected && isCorrect
                ? "bg-green-100 border-green-400"
                : isSelected && !isCorrect
                ? "bg-red-100 border-red-400"
                : "bg-white";

            return (
              <button
                key={idx}
                onClick={() => onChoose(idx)}
                className={`text-left border rounded-xl px-4 py-3 transition ${color}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Feedback + siguiente */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm">
            {status === "correct" && <span className="text-green-700">✅ ¡Correcto!</span>}
            {status === "wrong" && (
              <span className="text-red-700">
                ❌ Intenta de nuevo. (La respuesta correcta estaba disponible)
              </span>
            )}
          </div>
          {status !== "idle" && (
            <button
              onClick={next}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white font-semibold active:scale-[.99] transition"
            >
              Siguiente
            </button>
          )}
        </div>
      </Card>
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
    <div className="space-y-5">
      <Card>
        <div className="text-lg font-semibold">Has ganado un artefacto histórico</div>
        <div className="text-xs text-gray-600">Tema: “{lesson.title}”</div>

        <div className="mt-4 flex items-center gap-4">
          <div className="w-24 h-24 rounded-xl bg-amber-50 border grid place-items-center overflow-hidden">
            {lesson.artifact.imageUrl ? (
              <img
                src={lesson.artifact.imageUrl}
                alt="artefacto"
                className="object-contain w-full h-full"
              />
            ) : (
              <span className="text-4xl">🏺</span>
            )}
          </div>
          <div>
            <div className="text-base font-semibold">{lesson.artifact.name}</div>
            <div className="text-xs text-gray-500">¡Se añadió a tu colección!</div>
          </div>
        </div>

        <div className="mt-5 grid">
          <button
            onClick={onContinue}
            className="w-full px-4 py-3 rounded-xl bg-sky-600 text-white font-semibold active:scale-[.99] transition"
          >
            Volver a lecciones
          </button>
        </div>
      </Card>
    </div>
  );
}

// =============== FIN DE DEMO ===============
function EndOfDemoScreen({ show }: { show: boolean }) {
  return (
    <div className="space-y-5">
      <Card>
        <p className="text-sm">
          Gracias por jugar. Esta es una demo temprana de <strong>Cloud</strong> – el Duolingo de
          Historia. Si quieres ver más niveles, ¡mantente atento al lanzamiento oficial!
        </p>
      </Card>
    </div>
  );
}
