import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
  darkMode: boolean;
}

let uniqueIdCounter = 0;

export const Mermaid: React.FC<MermaidProps> = ({ chart, darkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Apply custom CSS visual enhancements for SVG text readability and typography
  useEffect(() => {
    const styleId = 'mermaid-visual-enhancements';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.innerHTML = `
      /* Force natural width and prevent squishing so letters are perfectly clear */
      .mermaid svg {
        max-width: none !important;
        width: 100% !important;
        height: auto !important;
        font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
      }

      /* Universal crisp text formatting */
      .mermaid svg text,
      .mermaid svg .actor text,
      .mermaid svg .messageText,
      .mermaid svg .noteText,
      .mermaid svg .loopText {
        font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
        font-size: 13px !important;
        letter-spacing: -0.01em !important;
      }
      
      /* Participant box text styling */
      .mermaid svg text.actor,
      .mermaid svg .actor text {
        font-size: 11px !important;
        font-weight: 600 !important;
        letter-spacing: 0.08em !important;
        text-transform: uppercase !important;
      }

      /* Note block text styling */
      .mermaid svg text.noteText,
      .mermaid svg .noteText,
      .mermaid svg .note text {
        font-size: 11px !important;
        font-weight: 500 !important;
        line-height: 1.4 !important;
      }

      /* Flow/signal lines label styling */
      .mermaid svg .messageText,
      .mermaid svg text.messageText {
        font-size: 12px !important;
        font-weight: 500 !important;
      }

      /* Box headers (e.g. box "GitHub", box "GitOps Project") */
      .mermaid svg text.box-title,
      .mermaid svg .box text {
        font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        letter-spacing: 0.1em !important;
        text-transform: uppercase !important;
      }

      /* FORCE HIGH CONTRAST DARK MODE COLORS */
      .dark .mermaid svg text,
      .dark .mermaid svg text.actor,
      .dark .mermaid svg text.noteText,
      .dark .mermaid svg text.messageText,
      .dark .mermaid svg text.box-title,
      .dark .mermaid svg text.actor > tspan,
      .dark .mermaid svg .actor text,
      .dark .mermaid svg .actor text tspan,
      .dark .mermaid svg .messageText tspan,
      .dark .mermaid svg .noteText tspan,
      .dark .mermaid svg .box text tspan,
      .dark .mermaid svg text tspan {
        fill: #fcfaf7 !important;
        color: #fcfaf7 !important;
      }
      .dark .mermaid svg rect.actor,
      .dark .mermaid svg .actor rect {
        fill: #141414 !important;
        stroke: #444444 !important;
        stroke-width: 1.5px !important;
      }
      .dark .mermaid svg .actor-line {
        stroke: #333333 !important;
        stroke-width: 1px !important;
      }
      .dark .mermaid svg .messageLine0, 
      .dark .mermaid svg .messageLine1 {
        stroke: #a3a3a3 !important;
        stroke-width: 1.5px !important;
      }
      .dark .mermaid svg rect.note,
      .dark .mermaid svg .note rect {
        fill: #1a1917 !important;
        stroke: #444444 !important;
        stroke-width: 1px !important;
      }
      .dark .mermaid svg rect.box,
      .dark .mermaid svg .box rect {
        fill: rgba(255, 255, 255, 0.02) !important;
        stroke: #2b2b2b !important;
        stroke-width: 1px !important;
      }
      .dark .mermaid svg .loopLine {
        stroke: #444444 !important;
        fill: rgba(255, 255, 255, 0.02) !important;
      }
      .dark .mermaid svg rect.activation,
      .dark .mermaid svg .activation {
        fill: #2b2b2b !important;
        stroke: #444444 !important;
      }

      /* FORCE HIGH CONTRAST LIGHT MODE COLORS (DEFAULT) */
      .mermaid svg text,
      .mermaid svg text.actor,
      .mermaid svg text.noteText,
      .mermaid svg text.messageText,
      .mermaid svg text.box-title,
      .mermaid svg text.actor > tspan,
      .mermaid svg .actor text,
      .mermaid svg .actor text tspan,
      .mermaid svg .messageText tspan,
      .mermaid svg .noteText tspan,
      .mermaid svg .box text tspan,
      .mermaid svg text tspan {
        fill: #000000 !important;
        color: #000000 !important;
      }
      .mermaid svg rect.actor,
      .mermaid svg .actor rect {
        fill: #f5eee3 !important;
        stroke: #1c1c1c !important;
        stroke-width: 1.5px !important;
      }
      .mermaid svg .actor-line {
        stroke: #1c1c1c !important;
        stroke-width: 1px !important;
        stroke-dasharray: 4 4 !important;
      }
      .mermaid svg .messageLine0, 
      .mermaid svg .messageLine1 {
        stroke: #1c1c1c !important;
        stroke-width: 1.5px !important;
      }
      .mermaid svg rect.note,
      .mermaid svg .note rect {
        fill: #ffffff !important;
        stroke: #1c1c1c !important;
        stroke-width: 1px !important;
      }
      .mermaid svg rect.box,
      .mermaid svg .box rect {
        fill: rgba(0, 0, 0, 0.03) !important;
        stroke: #1c1c1c !important;
        stroke-width: 1px !important;
        stroke-dasharray: 2 2 !important;
      }
      .mermaid svg .loopLine {
        stroke: #1c1c1c !important;
        fill: rgba(0, 0, 0, 0.02) !important;
      }
      .mermaid svg rect.activation,
      .mermaid svg .activation {
        fill: #ebdcc4 !important;
        stroke: #1c1c1c !important;
      }
    `;

    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      try {
        const id = `mermaid-svg-${uniqueIdCounter++}`;
        const cleanChart = chart.trim();

        // Initialize with robust pre-configured themes
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'loose',
          fontFamily: 'JetBrains Mono, monospace',
          themeVariables: {
            fontFamily: 'JetBrains Mono, monospace',
            actorFontFamily: 'JetBrains Mono, monospace',
            noteFontFamily: 'JetBrains Mono, monospace',
            messageFontFamily: 'JetBrains Mono, monospace',
          },
        });

        const { svg: renderedSvg } = await mermaid.render(id, cleanChart);
        if (isMounted) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setError(String(err));
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, darkMode]);

  return (
    <div className="w-full overflow-x-auto py-6 select-none scrollbar-thin">
      <div 
        ref={containerRef} 
        className="mermaid min-w-[1500px] w-full text-o5-ink transition-colors duration-500"
        dangerouslySetInnerHTML={{ __html: svg || '<div class="text-center font-mono text-xs opacity-50 py-12">Rendering architecture diagram...</div>' }} 
      />
    </div>
  );
};
