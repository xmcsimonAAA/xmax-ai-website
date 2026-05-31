import { useEffect, useRef, useState } from "react";

/* ─── 字符串解析工具 ─────────────────────────── */

function parseCountValue(raw: string | number): { num: number; suffix: string; decimals: number } {
  if (typeof raw === "number") return { num: raw, suffix: "", decimals: 0 };
  const suffixMatch = raw.match(/[^0-9.]$/);
  const suffix = suffixMatch ? suffixMatch[0] : "";
  const numeric = raw.replace(/[^0-9.]/g, "");
  const hasDecimal = numeric.includes(".");
  const num = parseFloat(numeric);
  return { num: isNaN(num) ? 0 : num, suffix, decimals: hasDecimal ? 1 : 0 };
}

/**
 * 数字计数动画 Hook — 数字从 0 跳动到目标值（纯 React）
 */
export function useCountUp(
  target: number,
  options: {
    duration?: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
  } = {}
) {
  const { duration = 1.5, prefix = "", suffix = "", decimals = 0 } = options;
  const [display, setDisplay] = useState(prefix + "0" + suffix);
  const rafRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    const startVal = 0;
    startTimeRef.current = 0;

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (target - startVal) * eased;

      setDisplay(prefix + current.toFixed(decimals) + suffix);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    const timer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(step);
    }, 100);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, prefix, suffix, decimals]);

  return { display };
}

/* ─── CountUp 组件（支持 number | string） ─────── */

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.5,
  className = "",
}: {
  value: number | string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  if (typeof value === "number") {
    const { display } = useCountUp(value, { prefix, suffix, decimals, duration });
    return <span className={className}>{display}</span>;
  }
  const parsed = parseCountValue(value);
  const { display } = useCountUp(parsed.num, {
    prefix,
    suffix: parsed.suffix || suffix,
    decimals: parsed.decimals || decimals,
    duration,
  });
  return <span className={className}>{display}</span>;
}

/* ─── AnimatedCounter（滚动触发版，兼容 string） ─── */

export function AnimatedCounter({
  value,
  className = "",
}: {
  value: string | number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          setInView(true);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!inView) {
    return <div ref={ref} className={className}>0</div>;
  }

  return (
    <div ref={ref} className={className}>
      <CountUp value={value} duration={1.5} />
    </div>
  );
}
