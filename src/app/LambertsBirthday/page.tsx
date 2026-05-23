"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./birthday.module.css";

const CONFETTI_COLORS = [
  "#FF4444",
  "#FFC107",
  "#4CAF50",
  "#2196F3",
  "#9C27B0",
  "#FF9800",
  "#00BCD4",
  "#E91E63",
  "#8BC34A",
  "#FFEB3B",
  "#5FDCDC",
  "#FF6F61",
];

const HOTBAR_ITEMS = ["🎂", "⚔", "⛏", "💎", "🍞", "🎁", "🧨", "❤", "★"];

const SIGN_LINES = [
  "Hey Lambert — happy birthday, legend!",
  "May your day be more epic than diamonds at bedrock,",
  "more chill than a slow boat through a coral reef,",
  "and more joyful than the moment a creeper",
  "decides NOT to explode.",
];

type ConfettiPiece = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  rotation: number;
  size: number;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  kind: "heart" | "diamond" | "xp";
};

let confettiId = 0;
let particleId = 0;

function makeConfetti(count: number, instant = false): ConfettiPiece[] {
  const pieces: ConfettiPiece[] = [];
  for (let i = 0; i < count; i++) {
    pieces.push({
      id: confettiId++,
      left: Math.random() * 100,
      delay: instant ? Math.random() * 0.6 : Math.random() * 6,
      duration: 3.5 + Math.random() * 4,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
      size: 8 + Math.floor(Math.random() * 10),
    });
  }
  return pieces;
}

export default function LambertsBirthdayPage() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [cakeSlices, setCakeSlices] = useState(7);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [activeSlot, setActiveSlot] = useState(0);
  const [achievement, setAchievement] = useState<{
    id: number;
    text: string;
  } | null>(null);
  const achievementQueue = useRef<string[]>([]);
  const achievementIdRef = useRef(0);

  useEffect(() => {
    setConfetti(makeConfetti(70));
  }, []);

  const showNextAchievement = useCallback(() => {
    const next = achievementQueue.current.shift();
    if (!next) {
      setAchievement(null);
      return;
    }
    const id = ++achievementIdRef.current;
    setAchievement({ id, text: next });
    window.setTimeout(() => {
      setAchievement((curr) => (curr?.id === id ? null : curr));
      window.setTimeout(showNextAchievement, 250);
    }, 3300);
  }, []);

  const triggerAchievement = useCallback(
    (text: string) => {
      achievementQueue.current.push(text);
      if (!achievement) showNextAchievement();
    },
    [achievement, showNextAchievement],
  );

  useEffect(() => {
    const t = window.setTimeout(
      () => triggerAchievement("Another Year of XP"),
      700,
    );
    return () => window.clearTimeout(t);
  }, [triggerAchievement]);

  const spawnParticles = (
    x: number,
    y: number,
    kind: Particle["kind"],
    count = 6,
  ) => {
    const fresh: Particle[] = [];
    for (let i = 0; i < count; i++) {
      fresh.push({
        id: particleId++,
        x: x + (Math.random() - 0.5) * 50,
        y: y + (Math.random() - 0.5) * 16,
        kind,
      });
    }
    setParticles((p) => [...p, ...fresh]);
    const ids = new Set(fresh.map((p) => p.id));
    window.setTimeout(() => {
      setParticles((curr) => curr.filter((p) => !ids.has(p.id)));
    }, 1300);
  };

  const grantXp = (amount: number) => {
    setXp((curr) => {
      const total = curr + amount;
      if (total >= 100) {
        setLevel((l) => {
          const next = l + 1;
          triggerAchievement(`Level Up — Level ${next}`);
          return next;
        });
        return total - 100;
      }
      return total;
    });
  };

  const handleCakeClick = (e: React.MouseEvent) => {
    if (cakeSlices === 0) return;
    spawnParticles(e.clientX, e.clientY, "heart", 7);
    grantXp(14);
    setCakeSlices((s) => {
      const next = s - 1;
      if (next === 0) {
        triggerAchievement("Cake Master — ate the whole cake");
      } else if (next === 3) {
        triggerAchievement("Birthday Wish granted");
      }
      return next;
    });
  };

  const handleDiamondClick = (e: React.MouseEvent) => {
    spawnParticles(e.clientX, e.clientY, "diamond", 8);
    grantXp(11);
    if (Math.random() < 0.25) {
      triggerAchievement("Lucky Mine — diamond drop!");
    }
  };

  const handleTntClick = (e: React.MouseEvent) => {
    spawnParticles(e.clientX, e.clientY, "xp", 10);
    grantXp(20);
    const burst = makeConfetti(60, true);
    setConfetti((c) => [...c, ...burst]);
    triggerAchievement("Celebrate Mode Activated");
    window.setTimeout(() => {
      setConfetti((c) => c.filter((piece) => !burst.some((b) => b.id === piece.id)));
    }, 9000);
  };

  return (
    <div className={styles.page}>
      {/* Sky decorations */}
      <div className={styles.sky}>
        <div className={`${styles.cloud} ${styles.cloud1}`} />
        <div className={`${styles.cloud} ${styles.cloud2}`} />
        <div className={`${styles.cloud} ${styles.cloud3}`} />
        <div className={styles.sun} />
      </div>

      {/* Health hearts */}
      <div className={styles.hearts}>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={styles.heart}>
            ♥
          </span>
        ))}
      </div>

      {/* Achievement popup */}
      {achievement && (
        <div key={achievement.id} className={styles.achievementBar}>
          <div className={styles.achievementIcon}>★</div>
          <div>
            <div className={styles.achievementTitle}>Achievement Get!</div>
            <div className={styles.achievementDesc}>{achievement.text}</div>
          </div>
        </div>
      )}

      {/* Confetti */}
      <div className={styles.confettiContainer} aria-hidden>
        {confetti.map((p) => (
          <div
            key={p.id}
            className={styles.confetti}
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              background: p.color,
              width: `${p.size}px`,
              height: `${p.size}px`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      {particles.map((p) => {
        const cls =
          p.kind === "heart"
            ? styles.particleHeart
            : p.kind === "diamond"
              ? styles.particleDiamond
              : styles.particleXp;
        return (
          <div
            key={p.id}
            className={`${styles.particle} ${cls}`}
            style={{ left: p.x, top: p.y }}
          >
            {p.kind === "heart" && "♥"}
            {p.kind === "diamond" && "♦"}
            {p.kind === "xp" && "+XP"}
          </div>
        );
      })}

      {/* Walking creeper */}
      <div className={styles.creeper} aria-hidden>
        <div className={styles.creeperHead}>
          <div className={styles.creeperMouth} />
        </div>
        <div className={styles.creeperBody} />
      </div>

      {/* Main content */}
      <main className={styles.content}>
        <h1 className={styles.title}>
          <span className={styles.titleLine1}>HAPPY BIRTHDAY</span>
          <span className={styles.titleLine2}>LAMBERT!</span>
        </h1>
        <p className={styles.subtitle}>~ A new level has been unlocked ~</p>

        <div className={styles.sign}>
          {SIGN_LINES.map((line, i) => (
            <span key={i} className={styles.signLine}>
              {line}
            </span>
          ))}
          <span className={styles.signEmphasis}>
            Welcome to a new level. Let&apos;s gooo!
          </span>
        </div>

        <div className={styles.xpSection}>
          <div className={styles.levelBadge}>Lv. {level}</div>
          <div className={styles.xpBar}>
            <div className={styles.xpFill} style={{ width: `${xp}%` }} />
            <div className={styles.xpText}>{xp} / 100 XP</div>
          </div>
        </div>

        <div className={styles.interactiveRow}>
          <button
            type="button"
            className={styles.blockButton}
            onClick={handleCakeClick}
            disabled={cakeSlices === 0}
            aria-label="Eat a slice of cake"
          >
            <div className={styles.cake}>
              <div className={styles.cakeBody} />
              {cakeSlices > 0 && (
                <div className={styles.candle}>
                  <div className={styles.flame} />
                </div>
              )}
            </div>
            <span className={styles.blockLabel}>
              {cakeSlices > 0 ? `Eat cake (${cakeSlices})` : "Cake demolished"}
            </span>
          </button>

          <button
            type="button"
            className={styles.blockButton}
            onClick={handleDiamondClick}
            aria-label="Mine a diamond"
          >
            <div className={styles.diamondBlock} />
            <span className={styles.blockLabel}>Mine diamond</span>
          </button>

          <button
            type="button"
            className={styles.blockButton}
            onClick={handleTntClick}
            aria-label="Light the TNT"
          >
            <div className={styles.tntBlock}>
              <div className={styles.tntLabel}>TNT</div>
            </div>
            <span className={styles.blockLabel}>Celebrate!</span>
          </button>
        </div>
      </main>

      {/* Ground */}
      <div className={styles.ground} aria-hidden>
        <div className={styles.grassRow} />
        <div className={styles.dirtRow} />
      </div>

      {/* Hotbar */}
      <div className={styles.hotbar} role="toolbar" aria-label="Hotbar">
        {HOTBAR_ITEMS.map((item, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.hotbarSlot} ${
              activeSlot === i ? styles.hotbarSlotActive : ""
            }`}
            onClick={() => setActiveSlot(i)}
            aria-label={`Hotbar slot ${i + 1}`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Home link */}
      <Link href="/" className={styles.homeLink}>
        ← Return to spawn
      </Link>
    </div>
  );
}
