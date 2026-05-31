import { useEffect, useRef, useState } from "react";

/**
 * 打字机动效 Hook — 纯 React 实现，零外部依赖
 */
export function useTypewriter(
  text: string,
  options: { speed?: number; showCursor?: boolean; trigger?: boolean } = {}
) {
  const { speed = 0.04, showCursor = true, trigger = true } = options;
  const [displayText, setDisplayText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!text || !trigger) return;
    setDisplayText("");
    setIsDone(false);

    let charIndex = 0;
    let lastTime = 0;
    const chars = text.split("");
    const msPerChar = speed * 1000;

    const step = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      if (elapsed >= msPerChar) {
        lastTime = timestamp - (elapsed % msPerChar);
        charIndex++;
        setDisplayText(chars.slice(0, charIndex).join(""));

        if (charIndex >= chars.length) {
          setIsDone(true);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    const startTimer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(step);
    }, 200);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [text, speed, trigger]);

  // 闪烁光标
  const [cursorVisible, setCursorVisible] = useState(showCursor);
  useEffect(() => {
    if (!showCursor || isDone) {
      setCursorVisible(false);
      return;
    }
    const interval = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(interval);
  }, [showCursor, isDone]);

  return { displayText, cursor: cursorVisible ? "|" : "\u00A0", isDone };
}

export function TypewriterText({
  text,
  className = "",
  speed = 0.04,
  showCursor = true,
}: {
  text: string;
  className?: string;
  speed?: number;
  showCursor?: boolean;
}) {
  const { displayText, cursor } = useTypewriter(text, { speed, showCursor });
  return (
    <span className={className}>
      {displayText}
      <span className="text-blue-400 opacity-70">{cursor}</span>
    </span>
  );
}

/* ─── 滚动触发打字机 ─────────────────────────── */

export function TypewriterOnView({
  text,
  className = "",
  speed = 0.04,
  showCursor = true,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  speed?: number;
  showCursor?: boolean;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { displayText, cursor } = useTypewriter(text, {
    speed,
    showCursor,
    trigger: triggered,
  });

  const Comp = Tag as any;
  return (
    <Comp ref={ref} className={className}>
      {displayText}
      {showCursor && <span className="text-blue-400 opacity-70">{cursor}</span>}
    </Comp>
  );
}
