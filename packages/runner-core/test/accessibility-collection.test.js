import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createAccessibilityFindingCollector } from "@stagehand/runner-core";
import { validateResult } from "@stagehand/result-model";

function node(html = '<input id="email">') {
  return { html, target: ["iframe", ["form-shell", "#email"]], xpath: ["/input"], impact: "serious", failureSummary: "Synthetic summary", any: [{ relatedNodes: [{ html: "<label>Email</label>", target: [["form-shell", "label"]], xpath: ["/label"] }] }], all: [], none: [] };
}

function scan(nodes = [node()]) {
  return { url: "https://example.test/form", violations: [{ id: "synthetic-rule", impact: "serious", description: "Synthetic description", help: "Synthetic help", helpUrl: "https://example.test/help", tags: ["wcag2a"], nodes }], incomplete: [], passes: [], inapplicable: [] };
}

function findings(collector) {
  const output = collector.getFindings();
  const document = JSON.parse(readFileSync(new URL("../../result-model/examples/checkout-result.json", import.meta.url), "utf8"));
  document.cases[0].accessibilityFindings = output;
  assert.deepEqual(validateResult(document), { valid: true });
  for (const finding of output) assert.equal(finding.affectedNodeCount, finding.affectedNodes.length);
  return output;
}

test("starts empty and repeated scans retain only first-seen markup within a case", () => {
  const collector = createAccessibilityFindingCollector();
  assert.deepEqual(findings(collector), []);
  collector.add(scan([node(), node()]));
  collector.add(scan());
  const output = findings(collector);
  assert.equal(output.length, 1);
  assert.equal(output[0].affectedNodeCount, 1);
});

test("appends new markup in observation order and updates counts across repeated violation records", () => {
  const collector = createAccessibilityFindingCollector();
  collector.add(scan());
  const next = scan([node(), node("<button>Next</button>")]);
  next.violations.push({ ...next.violations[0], nodes: [node("<a>Continue</a>")] });
  collector.add(next);
  const output = findings(collector);
  assert.deepEqual(output[0].affectedNodes.map(n => n.html), ['<input id="email">', "<button>Next</button>", "<a>Continue</a>"]);
  assert.equal(output[0].affectedNodeCount, 3);
});

test("groups by exact URL and description, with collision-safe keys and first-seen finding order", () => {
  const collector = createAccessibilityFindingCollector();
  const original = scan();
  collector.add(original);
  collector.add({ ...scan(), url: "https://example.test/other" });
  const otherDescription = scan();
  otherDescription.violations[0].description = "Different description";
  collector.add(otherDescription);
  const output = findings(collector);
  assert.equal(output.length, 3);
  assert.deepEqual(output.map(f => [f.url, f.description]), [[original.url, "Synthetic description"], ["https://example.test/other", "Synthetic description"], [original.url, "Different description"]]);
});

test("keeps first finding metadata and first node evidence when markup repeats", () => {
  const collector = createAccessibilityFindingCollector();
  const original = scan();
  collector.add(original);
  const changed = scan();
  Object.assign(changed.violations[0], { id: "different-rule", impact: "critical", help: "Changed help", tags: ["best-practice"] });
  Object.assign(changed.violations[0].nodes[0], { target: ["#different"], xpath: [], impact: null, failureSummary: "Changed summary" });
  collector.add(changed);
  const output = findings(collector);
  assert.equal(output[0].ruleId, original.violations[0].id);
  assert.equal(output[0].impact, "serious");
  assert.deepEqual(output[0].tags, ["wcag2a"]);
  assert.equal(output[0].help, "Synthetic help");
  assert.deepEqual(output[0].affectedNodes[0].target, original.violations[0].nodes[0].target);
  assert.equal(output[0].affectedNodes[0].failureSummary, "Synthetic summary");
  assert.equal(output[0].affectedNodeCount, 1);
});

test("separate collectors isolate cases even with shared scan input", () => {
  const first = createAccessibilityFindingCollector();
  const second = createAccessibilityFindingCollector();
  const shared = scan();
  first.add(shared);
  second.add(shared);
  first.add(scan([node("<button>Next</button>")]));
  assert.equal(findings(first)[0].affectedNodeCount, 2);
  assert.equal(findings(second)[0].affectedNodeCount, 1);
});

test("does not mutate scans or share nested input/output references", () => {
  const collector = createAccessibilityFindingCollector();
  const raw = scan();
  const before = structuredClone(raw);
  collector.add(raw);
  assert.deepEqual(raw, before);
  raw.violations[0].nodes[0].target[1][0] = "changed input";
  raw.violations[0].tags.push("changed-input-tag");
  const output = findings(collector);
  output[0].affectedNodes[0].target[1][0] = "changed output";
  output[0].affectedNodes[0].relatedNodes[0].target[0][0] = "changed related target";
  output[0].affectedNodes[0].relatedNodes[0].xpath.push("changed XPath");
  output[0].tags.push("changed-output-tag");
  output.push(structuredClone(output[0]));
  const fresh = findings(collector);
  assert.equal(fresh.length, 1);
  assert.deepEqual(fresh[0].tags, ["wcag2a"]);
  assert.deepEqual(fresh[0].affectedNodes[0].target, before.violations[0].nodes[0].target);
  assert.deepEqual(fresh[0].affectedNodes[0].relatedNodes, before.violations[0].nodes[0].any[0].relatedNodes);
  collector.add(scan([node("<button>Next</button>")]));
  assert.equal(fresh[0].affectedNodeCount, 1);
});

test("empty and non-violation scans preserve collected findings without interpreting errors", () => {
  const collector = createAccessibilityFindingCollector();
  collector.add(scan());
  const before = findings(collector);
  const raw = { ...scan(), violations: [], incomplete: [{ error: "Synthetic incomplete" }], passes: [{}], inapplicable: [{}] };
  const original = structuredClone(raw);
  collector.add(raw);
  assert.deepEqual(findings(collector), before);
  assert.deepEqual(raw, original);
});

test("preserves zero-node findings and counts later nodes including empty markup", () => {
  const collector = createAccessibilityFindingCollector();
  collector.add(scan([]));
  assert.equal(findings(collector)[0].affectedNodeCount, 0);
  collector.add(scan([node(""), node("")]));
  assert.equal(findings(collector)[0].affectedNodeCount, 1);
  assert.equal(findings(collector)[0].affectedNodes[0].html, "");
});
