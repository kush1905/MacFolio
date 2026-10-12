"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { HomeProject, TechNode } from "@/lib/portfolio";
import { useSceneStore } from "@/store/sceneStore";

const DEFAULT_TECH = "react-native";

export function TechCore({
  groups,
  nodes,
  projects,
}: {
  groups: string[];
  nodes: TechNode[];
  projects: HomeProject[];
}) {
  const stored = useSceneStore((state) => state.activeTech);
  const setActiveTech = useSceneStore((state) => state.setActiveTech);
  const activeSlug = stored ?? DEFAULT_TECH;
  const active = nodes.find((node) => node.slug === activeSlug) ?? nodes[0];

  useEffect(() => () => setActiveTech(null), [setActiveTech]);

  const usedIn = projects.filter((project) =>
    active.projects.includes(project.slug),
  );

  return (
    <div className="core">
      <div className="core-groups">
        {groups.map((group) => (
          <fieldset key={group}>
            <legend>{group}</legend>
            {nodes
              .filter((node) => node.group === group)
              .map((node) => (
                <button
                  key={node.slug}
                  type="button"
                  aria-pressed={node.slug === active.slug}
                  onClick={() => setActiveTech(node.slug)}
                >
                  {node.name}
                </button>
              ))}
          </fieldset>
        ))}
      </div>
      {/* Stable live region; the inner card remounts per technology so it can flip in. */}
      <div aria-live="polite">
        <div className="core-panel" data-tilt key={active.slug}>
          <p className="core-group">{active.group}</p>
          <h3>{active.name}</h3>
          <p>{active.use}</p>
          <h4>Evidence</h4>
          <ul>
            {active.proof.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {usedIn.length > 0 ? (
            <>
              <h4>Used in</h4>
              <ul className="core-projects">
                {usedIn.map((project) => (
                  <li key={project.slug}>
                    <Link href={`/projects/${project.slug}`}>
                      {project.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          <p className="section-more">
            <Link href={`/stack/${active.slug}`}>More on {active.name} →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
