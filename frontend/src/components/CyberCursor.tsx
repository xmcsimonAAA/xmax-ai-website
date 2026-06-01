import { useEffect, useRef } from "react";

/**
 * 科技感自定义光标
 * - 小圆点核心 + 扩散外圈
 * - hover 可交互元素时放大 + 发光
 * - 点击时脉冲扩散
 */
export default function CyberCursor() {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    const outer = outerRef.current;
    const lens = lensRef.current;
    if (!inner || !outer || !lens) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: target.x, y: target.y };
    const outerCurrent = { x: target.x, y: target.y };
    let raf = 0;

    // 隐藏默认光标（桌面端）
    document.documentElement.classList.add("cyber-cursor");

    // 鼠标移动
    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.55;
      current.y += (target.y - current.y) * 0.55;
      outerCurrent.x += (target.x - outerCurrent.x) * 0.18;
      outerCurrent.y += (target.y - outerCurrent.y) * 0.18;

      inner.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      outer.style.transform = `translate3d(${outerCurrent.x}px, ${outerCurrent.y}px, 0) translate(-50%, -50%)`;
      lens.style.transform = `translate3d(${outerCurrent.x}px, ${outerCurrent.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    // 点击脉冲
    const onClick = () => {
      outer.classList.remove("click-pulse");
      void outer.offsetWidth;
      outer.classList.add("click-pulse");
    };

    const interactiveSelector = "a, button, input, textarea, select, [role='button'], .cursor-hover";
    let activeTarget: HTMLElement | null = null;
    const setActiveTarget = (nextTarget: HTMLElement | null) => {
      if (activeTarget === nextTarget) return;
      if (activeTarget) activeTarget.classList.remove("cyber-hover-active");
      activeTarget = nextTarget;

      if (activeTarget) {
        activeTarget.classList.add("cyber-hover-active");
        inner.classList.add("hover");
        outer.classList.add("hover");
        inner.classList.add("dot-hover");
        lens.classList.add("active");
      } else {
        inner.classList.remove("hover");
        outer.classList.remove("hover");
        inner.classList.remove("dot-hover");
        lens.classList.remove("active");
      }
    };

    const onPointerOver = (event: PointerEvent) => {
      const targetElement = event.target instanceof Element
        ? event.target.closest(interactiveSelector)
        : null;
      setActiveTarget(targetElement instanceof HTMLElement ? targetElement : null);
    };

    const onPointerOut = (event: PointerEvent) => {
      if (!activeTarget) return;
      const related = event.relatedTarget instanceof Element ? event.relatedTarget : null;
      if (related && activeTarget.contains(related)) return;
      setActiveTarget(null);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick);
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cyber-cursor");
      setActiveTarget(null);
    };
  }, []);

  return (
    <>
      {/* 外圈扩散环 */}
      <div
        ref={lensRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 86,
          height: 86,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
        }}
        className="cyber-cursor-lens"
      />
      <div
        ref={outerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1.5px solid rgba(59,130,246,0.3)",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
        }}
        className="cyber-cursor-ring"
      />
      {/* 核心小圆点 */}
      <div
        ref={innerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "rgba(59,130,246,0.7)",
          pointerEvents: "none",
          zIndex: 10000,
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
          boxShadow: "0 0 12px rgba(59,130,246,0.5), 0 0 4px rgba(147,197,253,0.3)",
        }}
        className="cyber-cursor-dot"
      />
    </>
  );
}
