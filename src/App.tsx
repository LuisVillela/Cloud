import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Cloud – Demo React SPA (Mobile-first, estilo Duolingo)
 * Flujo: Mapa → Video (fragmento YouTube) → Quiz → Victoria → Volver al mapa → Fin de demo
 *
 * Requisitos Tailwind v4:
 * - Asegúrate que en `src/index.css` tengas SOLO:  `@import "tailwindcss";`
 * - `postcss.config.cjs` debe usar: { plugins: { '@tailwindcss/postcss': {}, autoprefixer: {} } }
 */

// =============== CONFIG HARDCODEADA ===============
const LESSON = {
  id: "leccion-1",
  title: "La Peste Negra (siglo XIV)",
  // Video específico (YouTube) que pidió el Inge
  // URL: https://www.youtube.com/watch?v=uZKUthKdKKY
  // Fragmento: 3:14 (194s) → 4:25 (265s)
  videoId: "uZKUthKdKKY",
  start: 194,
  end: 266,
  // Personajes (usa rutas públicas)
  heroUrl: "/assets/cloud-hero.png",   // coloca tu PNG
  enemyUrl: "/assets/enemy-boss.png",  // coloca tu PNG
  artifact: {
    name: "Máscara de Doctor de la Peste",
    imageUrl: "/assets/plague-mask.png", // coloca tu PNG
  },
  // Preguntas tipo Duolingo (ejemplo)
  questions: [
    {
      prompt: "¿En qué continente comenzó a extenderse rápidamente la Peste Negra en el siglo XIV?",
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
      prompt: "¿Qué animal suele asociarse a la transmisión de la peste en esa época?",
      options: ["Gatos", "Ratas y pulgas", "Caballos", "Aves de corral"],
      answerIndex: 1,
    },
  ],
};

// Segundo “nivel” solo para fin de demo
const NEXT_LEVEL = {
  id: "leccion-2",
  title: "Siguiente lección (Bloqueada en demo)",
};

// =============== UI BASE ===============
function Badge({ children }: { children: any }) {
  return (
    <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
      {children}
    </span>
  );
}

function Card({ children, className = "" }: { children: any; className?: string }) {
  return (
    <div className={`rounded-2xl shadow-xl border border-white/60 bg-white/90 backdrop-blur p-4 ${className}`}>
      {children}
    </div>
  );
}

// =============== PANTALLAS ===============

type Screen = "map" | "video" | "quiz" | "victory" | "end";

export default function App() {
  const [screen, setScreen] = useState<Screen>("map");
  const [quizIndex, setQuizIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showFinDemo, setShowFinDemo] = useState(false);

  const startLesson = () => setScreen("video");
  const handleQuizComplete = () => setScreen("victory");
  const backToMap = () => setScreen("map");
  const tryNextLevel = () => {
    setShowFinDemo(true);
    setScreen("end");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-sky-50 to-indigo-50 text-gray-800">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-white/60">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sky-200 grid place-items-center text-sky-700 font-bold">☁️</div>
            <h1 className="text-xl font-bold">Cloud – Historia</h1>
          </div>
          <Badge>Demo</Badge>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-5">
        {screen === "map" && (
          <MapScreen onStartLesson={startLesson} onTryNextLevel={tryNextLevel} />
        )}

        {screen === "video" && (
          <VideoScreen lesson={LESSON} onFinish={() => setScreen("quiz")} />
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
      <h2 className="text-2xl font-extrabold">Mapa de lecciones</h2>
      <p className="text-sm text-gray-600">Haz clic en un nodo para comenzar. Esta demo contiene 1 lección jugable.</p>

      <div className="grid grid-cols-1 gap-3">
        {/* Nodo 1 */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 grid place-items-center text-2xl">🗺️</div>
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
            <div className="flex justify-end"><Badge>Desbloqueada</Badge></div>
          </div>
        </Card>

        {/* Nodo 2 (demo) */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 grid place-items-center text-2xl">🔒</div>
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
            <div className="flex justify-end"><Badge>Bloqueada (Demo)</Badge></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// =============== VIDEO (fragmento YouTube) ===============
function VideoScreen({
  lesson,
  onFinish,
}: {
  lesson: typeof LESSON;
  onFinish: () => void;
}) {
  const [started, setStarted] = useState(false);
  const timerRef = useRef<number | null>(null);
  const duration = Math.max(1, lesson.end - lesson.start);
  const embedUrl = useMemo(() => {
    const params = new URLSearchParams({
      start: String(lesson.start),
      end: String(lesson.end),
      autoplay: started ? "1" : "0",
      controls: "0",
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
    });
    return `https://www.youtube-nocookie.com/embed/${lesson.videoId}?${params.toString()}`;
  }, [lesson.videoId, lesson.start, lesson.end, started]);

  useEffect(() => {
    if (!started) return;
    timerRef.current = window.setTimeout(() => {
      onFinish();
    }, duration * 1000) as unknown as number;
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [started, duration, onFinish]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold">{lesson.title}</h2>
      <Card>
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/60">
          <iframe
            className="w-full h-full"
            src={embedUrl}
            title="Video lección"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        </div>
        <div className="mt-4 grid gap-2">
          <p className="text-sm text-gray-600">
            Mira este fragmento del video. Al terminar, pasarás automáticamente al desafío.
          </p>
          {!started ? (
            <button
              onClick={() => setStarted(true)}
              className="w-full px-4 py-3 rounded-xl bg-sky-600 text-white font-semibold active:scale-[.99] transition"
            >
              ▶️ Empezar fragmento
            </button>
          ) : (
            <button
              onClick={onFinish}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white font-semibold active:scale-[.99] transition"
            >
              Saltar al desafío
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}

// =============== QUIZ (estilo Duolingo) ===============
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
    <img src={lesson.heroUrl} alt="hero" className="h-20 object-contain" />
  ) : (
    <div className="h-20 w-20 grid place-items-center text-4xl">☁️</div>
  );
  const enemy = lesson.enemyUrl ? (
    <img src={lesson.enemyUrl} alt="enemy" className="h-20 object-contain" />
  ) : (
    <div className="h-20 w-20 grid place-items-center text-4xl">👹</div>
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
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold">Desafío</h2>
      <Card>
        {/* Barra de progreso */}
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-sky-500" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Enfrentamiento */}
        <div className="mt-4 flex items-center justify-between gap-6">
          <div className="flex-1 grid place-items-center">{hero}</div>
          <div className="text-lg font-semibold text-gray-500">VS</div>
          <div className="flex-1 grid place-items-center">{enemy}</div>
        </div>

        {/* Pregunta */}
        <div className="mt-4">
          <div className="text-base font-semibold">{q.prompt}</div>
          {q.hint && (
            <div className="text-xs text-gray-500 mt-1">Pista: {q.hint}</div>
          )}
        </div>

        {/* Opciones */}
        <div className="mt-3 grid grid-cols-1 gap-2">
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
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm">
            {status === "correct" && <span className="text-green-700">✅ ¡Correcto!</span>}
            {status === "wrong" && <span className="text-red-700">❌ Intenta de nuevo. (La respuesta correcta estaba disponible)</span>}
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
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold">¡Lo lograste!</h2>
      <Card>
        <div className="text-base font-semibold">Has ganado un artefacto histórico</div>
        <div className="text-xs text-gray-600">Tema: “{lesson.title}”</div>

        <div className="mt-4 flex items-center gap-4">
          <div className="w-24 h-24 rounded-xl bg-amber-50 border grid place-items-center overflow-hidden">
            {lesson.artifact.imageUrl ? (
              <img src={lesson.artifact.imageUrl} alt="artefacto" className="object-contain w-full h-full" />
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
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold">Fin de la demo</h2>
      <Card>
        <p className="text-sm">
          Gracias por jugar. Esta es una demo temprana de <strong>Cloud</strong> – el Duolingo de Historia.
          Si quieres ver más niveles, ¡mantente atento al lanzamiento oficial!
        </p>
      </Card>
    </div>
  );
}
