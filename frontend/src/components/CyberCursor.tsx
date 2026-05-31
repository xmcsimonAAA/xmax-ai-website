import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * 科技感自定义光标
 * - 小圆点核心 + 扩散外圈
 * - hover 可交互元素时放大 + 发光
 * - 点击时脉冲扩散
 */
export default function CyberCursor() {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const inner = innerRef.current;
    const outer = outerRef.current;
    if (!inner || !outer) return;

    // 隐藏默认光标（桌面端）
    document.documentElement.classList.add("cyber-cursor");

    // 鼠标移动
    const onMove = (e: MouseEvent) => {
      gsap.to([inner, outer], {
        x: e.clientX,
        y: e.clientY,
        duration: inner.classList.contains("hover") ? 0.15 : 0.25,
        ease: "power2.out",
        overwrite: "auto",
      });
      pos.current = { x: e.clientX, y: e.clientY };
    };

    // hover 可交互元素 — 光标放大 + 目标元素高亮
    const onEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      inner.classList.add("hover");
      target.classList.add("cyber-hover-active");
      gsap.to(outer, { scale: 2.5, borderColor: "rgba(96,165,250,0.8)", duration: 0.25 });
      gsap.to(inner, { scale: 0.4, backgroundColor: "rgba(147,197,253,1)", duration: 0.25 });
    };
    const onLeave = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      inner.classList.remove("hover");
      target.classList.remove("cyber-hover-active");
      gsap.to(outer, { scale: 1, borderColor: "rgba(59,130,246,0.3)", duration: 0.25 });
      gsap.to(inner, { scale: 1, backgroundColor: "rgba(59,130,246,0.7)", duration: 0.25 });
    };

    // 点击脉冲
    const onClick = () => {
      gsap.fromTo(
        outer,
        { scale: 2.5, opacity: 0.6 },
        { scale: 1, opacity: 0.3, duration: 0.5, ease: "power2.out" }
      );
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick);

    // 监听所有可交互元素
    const interactiveSelector = "a, button, input, textarea, select, [role='button'], .cursor-hover";
    const elements = document.querySelectorAll(interactiveSelector);
    elements.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // MutationObserver 监听新增的可交互元素
    const observer = new MutationObserver(() => {
      const newElements = document.querySelectorAll(interactiveSelector);
      newElements.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      observer.disconnect();
      document.documentElement.classList.remove("cyber-cursor");
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      {/* 外圈扩散环 */}
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
          transform: "translate(-50%, -50%)",
        }}
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
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 12px rgba(59,130,246,0.5), 0 0 4px rgba(147,197,253,0.3)",
        }}
      />
    </>
  );
}
