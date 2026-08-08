"use client";

import { useEffect, useRef } from "react";

export function FormulaBoard() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let stage: { destroy: () => void } | undefined;
    let observer: ResizeObserver | undefined;

    void import("konva").then(({ default: Konva }) => {
      if (disposed || !hostRef.current) return;
      const container = hostRef.current;
      const height = 112;
      const width = Math.max(container.clientWidth, 280);
      const konvaStage = new Konva.Stage({ container, width, height });
      stage = konvaStage;
      const layer = new Konva.Layer();
      konvaStage.add(layer);

      const nodes = [
        { x: 55, y: 56, label: "FORMULA", color: "#92003a" },
        { x: width * 0.42, y: 32, label: "SOURCE", color: "#3979e6" },
        { x: width * 0.67, y: 78, label: "CLAIM", color: "#f62477" },
        { x: width - 58, y: 38, label: "LABEL", color: "#20a47a" },
      ];
      const groups: InstanceType<typeof Konva.Group>[] = [];
      const connectors: InstanceType<typeof Konva.Line>[] = [];

      nodes.slice(0, -1).forEach((node, index) => {
        const next = nodes[index + 1];
        const connector = new Konva.Line({
          points: [node.x, node.y, next.x, next.y],
          stroke: "#b7afbb",
          strokeWidth: 2,
          dash: [6, 5],
        });
        connectors.push(connector);
        layer.add(connector);
      });

      nodes.forEach((node, index) => {
        const group = new Konva.Group({
          x: node.x,
          y: node.y,
          draggable: true,
        });
        group.add(
          new Konva.Circle({
            radius: index === 0 ? 23 : 18,
            fill: node.color,
            shadowColor: "#25222a",
            shadowBlur: 7,
            shadowOpacity: 0.16,
          }),
        );
        group.add(
          new Konva.Text({
            x: -34,
            y: index === 0 ? 31 : 26,
            width: 68,
            align: "center",
            text: node.label,
            fill: "#4c4650",
            fontFamily: "Nunito Sans Variable",
            fontSize: 9,
            fontStyle: "700",
          }),
        );
        group.on("dragmove", () => {
          if (index > 0) {
            const previous = groups[index - 1];
            connectors[index - 1].points([
              previous.x(),
              previous.y(),
              group.x(),
              group.y(),
            ]);
          }
          if (index < connectors.length) {
            const next = groups[index + 1];
            if (next)
              connectors[index].points([
                group.x(),
                group.y(),
                next.x(),
                next.y(),
              ]);
          }
        });
        groups.push(group);
        layer.add(group);
      });

      layer.draw();
      observer = new ResizeObserver(([entry]) => {
        const nextWidth = Math.max(entry.contentRect.width, 280);
        konvaStage.width(nextWidth);
        layer.batchDraw();
      });
      observer.observe(container);
    });

    return () => {
      disposed = true;
      observer?.disconnect();
      stage?.destroy();
    };
  }, []);

  return (
    <section className="lw-formula-board" data-resource="konva">
      <div>
        <span>RELATIONSHIP BOARD</span>
        <strong>Evidence lineage</strong>
      </div>
      <div
        ref={hostRef}
        className="lw-konva-host"
        aria-label="Interactive formula evidence map"
      />
    </section>
  );
}
