import type {
  ResultAccessibilityFinding,
  ResultAccessibilityNode,
  ResultAccessibilityRelatedNode,
} from "@stagehand/result-model";
import type { AccessibilityScanResults } from "./types.js";

type RawAccessibilityNode = AccessibilityScanResults["violations"][number]["nodes"][number];

function mapAccessibilityNode(node: RawAccessibilityNode): ResultAccessibilityNode {
  const relatedNodes = new Map<string, ResultAccessibilityRelatedNode>();
  for (const check of [...node.any, ...node.all, ...node.none]) {
    for (const related of check.relatedNodes ?? []) {
      const key = JSON.stringify([related.html, related.target, related.xpath]);
      if (!relatedNodes.has(key)) {
        relatedNodes.set(key, {
          html: related.html,
          target: structuredClone(related.target),
          ...(related.xpath !== undefined ? { xpath: [...related.xpath] } : {}),
        });
      }
    }
  }
  return {
    html: node.html,
    target: structuredClone(node.target),
    ...(node.failureSummary !== undefined ? { failureSummary: node.failureSummary } : {}),
    ...(node.impact !== undefined ? { impact: node.impact } : {}),
    ...(node.xpath !== undefined ? { xpath: [...node.xpath] } : {}),
    relatedNodes: [...relatedNodes.values()],
  };
}

export function mapAccessibilityFindings(
  results: AccessibilityScanResults,
): ResultAccessibilityFinding[] {
  return results.violations.map((violation) => {
    const affectedNodes = violation.nodes.map(mapAccessibilityNode);
    return {
      url: results.url,
      ruleId: violation.id,
      impact: violation.impact ?? null,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      tags: [...new Set(violation.tags)],
      affectedNodeCount: affectedNodes.length,
      affectedNodes,
    };
  });
}
