import { useEffect, useRef, useState } from "react";
import TopBar from "./ui/TopBar";
import Overview from "./ui/panels/Overview";
import HR from "./ui/panels/HR";
import FieldOps from "./ui/panels/FieldOps";
import Accounts from "./ui/panels/Accounts";
import Canteen from "./ui/panels/Canteen";
import Physio from "./ui/panels/Physio";
import Marketing from "./ui/panels/Marketing";
import { useGame } from "./game/store";

type TabKey = "overview" | "hr" | "fieldops" | "accounts" | "canteen" | "physio" | "marketing";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "hr", label: "HR" },
  { key: "fieldops", label: "Field Ops" },
  { key: "accounts", label: "Accounts" },
  { key: "canteen", label: "Canteen" },
  { key: "physio", label: "Physio" },
  { key: "marketing", label: "Marketing" },
];

function getInitialTab(): TabKey {
  const h = (typeof window !== "undefined" ? window.location.hash.slice(1) : "") as TabKey;
  const match = TABS.find(t => t.key === h);
  return match ? match.key : "overview";
}

export default function App() {
  const advance = useGame((s) => s.advance);
  const [tab, setTab] = useState<TabKey>(getInitialTab());

  const rafId = useRef(0);
  const last = useRef(performance.now());
  useEffect(() => {
    const loop = (t: number) => {
      const dt = t - last.current;
      last.current = t;
      advance(dt);
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, [advance]);

  useEffect(() => {
    const onHash = () => {
      const k = (window.location.hash.slice(1) as TabKey) || "overview";
      if (TABS.some(t => t.key === k)) setTab(k);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const setActive = (k: TabKey) => {
    if (k !== tab) {
      setTab(k);
      window.location.hash = k;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <TopBar />
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <nav className="flex flex-wrap gap-2">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={
                "rounded-full px-3 py-1 text-sm border " +
                (tab === key ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50")
              }
              aria-current={tab === key ? "page" : undefined}
            >
              {label}
            </button>
          ))}
        </nav>

        <section className="rounded-2xl bg-white p-4 shadow-sm min-h-[200px]">
          {tab === "overview" && (
            <>
              <h1 className="text-2xl font-semibold mb-3">Rogue Manager — Prototype</h1>
              <Overview />
            </>
          )}
          {tab === "hr" && <HR />}
          {tab === "fieldops" && <FieldOps />}
          {tab === "accounts" && <Accounts />}
          {tab === "canteen" && <Canteen />}
          {tab === "physio" && <Physio />}
          {tab === "marketing" && <Marketing />}
        </section>
      </div>
    </div>
  );
}
