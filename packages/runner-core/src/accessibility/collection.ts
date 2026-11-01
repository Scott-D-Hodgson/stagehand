import type { ResultAccessibilityFinding } from "@stagehand/result-model";
import type { AccessibilityFindingCollector } from "./types.js";
import { mapAccessibilityFindings } from "./mapping.js";

export function createAccessibilityFindingCollector(): AccessibilityFindingCollector {
  const findings = new Map<string, ResultAccessibilityFinding>();
  const markupByFinding = new Map<string, Set<string>>();
  return {
    add(results) {
      for (const finding of mapAccessibilityFindings(results)) {
        const key = JSON.stringify([finding.url, finding.description]);
        let accumulated = findings.get(key);
        if (!accumulated) {
          accumulated = { ...finding, affectedNodes: [], affectedNodeCount: 0 };
          findings.set(key, accumulated);
          markupByFinding.set(key, new Set());
        }
        const markup = markupByFinding.get(key)!;
        for (const node of finding.affectedNodes) {
          if (!markup.has(node.html)) {
            markup.add(node.html);
            accumulated.affectedNodes.push(node);
          }
        }
        accumulated.affectedNodeCount = accumulated.affectedNodes.length;
      }
    },
    getFindings() {
      return structuredClone([...findings.values()]);
    },
  };
}
