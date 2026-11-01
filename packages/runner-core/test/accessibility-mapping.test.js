import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { mapAccessibilityFindings } from "@stagehand/runner-core";
import { validateResult } from "@stagehand/result-model";

function rawNode() {
  return {
    html: '<input id="email">',
    target: ["iframe#form", ["form-shell", "#email"]],
    xpath: ["/html/body/iframe", "/html/body/form-shell/input"],
    impact: "serious",
    failureSummary: "Synthetic missing label evidence.",
    any: [],
    all: [],
    none: [],
  };
}

function rawRelatedNode() {
  return {
    html: '<label for="other">Email</label>',
    target: ["iframe#form", ["form-shell", "label"]],
    xpath: ["/html/body/iframe", "/html/body/form-shell/label"],
  };
}

function check(relatedNodes) {
  return { id: "synthetic-check", impact: "serious", message: "Synthetic check.", data: {}, relatedNodes };
}

function observations() {
  return {
    url: "https://example.test/form",
    timestamp: "2026-11-01T12:00:00Z",
    testEngine: { name: "axe-core", version: "4.14.0" },
    testRunner: { name: "synthetic" },
    testEnvironment: { userAgent: "synthetic", windowWidth: 1280, windowHeight: 720 },
    toolOptions: {},
    violations: [{
      id: "synthetic-rule",
      impact: "serious",
      description: "Synthetic form-label finding.",
      help: "Review the form label.",
      helpUrl: "https://example.test/help/form-label",
      tags: ["wcag2a", "cat.forms"],
      nodes: [rawNode()],
    }],
    incomplete: [],
    passes: [],
    inapplicable: [],
  };
}

function mapAndValidate(results) {
  const findings = mapAccessibilityFindings(results);
  const document = JSON.parse(readFileSync(new URL("../../result-model/examples/checkout-result.json", import.meta.url), "utf8"));
  document.cases[0].accessibilityFindings = findings;
  assert.deepEqual(validateResult(document), { valid: true });
  return findings;
}

test("maps finding metadata and all selected node evidence into the shared result contract", () => {
  const raw = observations();
  const related = rawRelatedNode();
  raw.violations[0].nodes[0].any = [check([related])];
  assert.deepEqual(mapAndValidate(raw), [{
    url: raw.url,
    ruleId: "synthetic-rule",
    impact: "serious",
    description: "Synthetic form-label finding.",
    help: "Review the form label.",
    helpUrl: "https://example.test/help/form-label",
    tags: ["wcag2a", "cat.forms"],
    affectedNodeCount: 1,
    affectedNodes: [{
      html: '<input id="email">',
      target: ["iframe#form", ["form-shell", "#email"]],
      xpath: ["/html/body/iframe", "/html/body/form-shell/input"],
      failureSummary: "Synthetic missing label evidence.",
      impact: "serious",
      relatedNodes: [related],
    }],
  }]);
});

test("flattens any/all/none related elements and removes exact projected duplicates in first-seen order", () => {
  const raw = observations();
  const first = rawRelatedNode();
  const second = { ...rawRelatedNode(), html: "<span>Second</span>" };
  const third = { ...rawRelatedNode(), html: "<span>Third</span>" };
  const node = raw.violations[0].nodes[0];
  node.any = [check([first]), { id: "no-related-elements" }];
  node.all = [check([structuredClone(first), second])];
  node.none = [check([structuredClone(second), third, { ...first, element: {} }])];
  assert.deepEqual(mapAndValidate(raw)[0].affectedNodes[0].relatedNodes, [first, second, third]);
});

test("keeps same markup with different related targets, XPath, or XPath availability", () => {
  const raw = observations();
  const first = rawRelatedNode();
  const differentTarget = { ...rawRelatedNode(), target: ["#other"] };
  const differentXPath = { ...rawRelatedNode(), xpath: ["/different"] };
  const emptyXPath = { ...rawRelatedNode(), xpath: [] };
  const absentXPath = rawRelatedNode();
  delete absentXPath.xpath;
  const related = [first, differentTarget, differentXPath, emptyXPath, absentXPath];
  raw.violations[0].nodes[0].any = [check(related)];
  assert.deepEqual(mapAndValidate(raw)[0].affectedNodes[0].relatedNodes, related);
});

test("maps absent finding severity to null and preserves absent versus null node severity", () => {
  for (const impact of [undefined, null]) {
    const raw = observations();
    raw.violations[0].impact = impact;
    const node = raw.violations[0].nodes[0];
    node.impact = impact;
    delete node.failureSummary;
    delete node.xpath;
    node.target = [];
    const finding = mapAndValidate(raw)[0];
    assert.equal(finding.impact, null);
    assert.equal(Object.hasOwn(finding.affectedNodes[0], "impact"), impact !== undefined);
    assert.equal(finding.affectedNodes[0].impact, impact);
    assert.equal(Object.hasOwn(finding.affectedNodes[0], "failureSummary"), false);
    assert.equal(Object.hasOwn(finding.affectedNodes[0], "xpath"), false);
    assert.deepEqual(finding.affectedNodes[0].relatedNodes, []);
  }
});

test("retains empty optional evidence when present instead of inventing or discarding values", () => {
  const raw = observations();
  const node = raw.violations[0].nodes[0];
  node.failureSummary = "";
  node.xpath = [];
  node.html = "";
  const related = { html: "", target: [] };
  node.none = [check([related])];
  const mapped = mapAndValidate(raw)[0].affectedNodes[0];
  assert.equal(mapped.failureSummary, "");
  assert.deepEqual(mapped.xpath, []);
  assert.deepEqual(mapped.relatedNodes, [related]);
});

test("maps only violations, leaving incomplete/error observations and other groups untouched", () => {
  const raw = observations();
  raw.incomplete = [{ ...structuredClone(raw.violations[0]), error: { message: "Synthetic rule execution error." } }];
  raw.passes = [structuredClone(raw.violations[0])];
  raw.inapplicable = [structuredClone(raw.violations[0])];
  const original = structuredClone(raw);
  assert.equal(mapAndValidate(raw).length, 1);
  assert.deepEqual(raw, original);
  raw.violations = [];
  assert.deepEqual(mapAndValidate(raw), []);
});

test("counts affected nodes without merging repeated markup or findings within or across calls", () => {
  const raw = observations();
  raw.violations[0].nodes.push({ ...rawNode(), target: ["#second"] });
  raw.violations.push(structuredClone(raw.violations[0]));
  const mapped = mapAndValidate(raw);
  assert.equal(mapped.length, 2);
  assert.equal(mapped[0].affectedNodeCount, 2);
  assert.equal(mapped[0].affectedNodes.length, 2);
  assert.equal(mapped[1].affectedNodeCount, 2);
  assert.deepEqual(mapAndValidate(raw), mapped);
  raw.violations[0].nodes = [];
  const empty = mapAndValidate(raw)[0];
  assert.equal(empty.affectedNodeCount, 0);
  assert.deepEqual(empty.affectedNodes, []);
});

test("projects only selected fields without traversing live elements or check data", () => {
  const raw = observations();
  const node = raw.violations[0].nodes[0];
  node.element = { notCloneable() {} };
  node.ancestry = ["not selected"];
  const related = { ...rawRelatedNode(), element: { notCloneable() {} }, ancestry: ["not selected"] };
  const data = {};
  data.cycle = data;
  node.any = [{ ...check([related]), data }];
  const mapped = mapAndValidate(raw)[0].affectedNodes[0];
  for (const key of ["any", "all", "none", "element", "ancestry", "data"]) {
    assert.equal(Object.hasOwn(mapped, key), false);
  }
  assert.deepEqual(Object.keys(mapped.relatedNodes[0]).sort(), ["html", "target", "xpath"]);
});

test("copies all output arrays and nested target paths without sharing input or sibling output references", () => {
  const raw = observations();
  raw.violations[0].nodes[0].any = [check([rawRelatedNode()])];
  raw.violations[0].nodes.push(raw.violations[0].nodes[0]);
  const original = structuredClone(raw);
  const first = mapAndValidate(raw);
  const second = mapAndValidate(raw);
  first[0].tags.push("synthetic-extra");
  first[0].affectedNodes[0].target[1][0] = "changed-host";
  first[0].affectedNodes[0].xpath.push("/changed");
  first[0].affectedNodes[0].relatedNodes[0].target[1][0] = "changed-related-host";
  first[0].affectedNodes[0].relatedNodes[0].xpath.push("/changed-related");
  assert.deepEqual(raw, original);
  assert.deepEqual(second, mapAndValidate(raw));
  assert.deepEqual(first[0].affectedNodes[1].target, original.violations[0].nodes[1].target);
  assert.deepEqual(first[0].affectedNodes[1].relatedNodes[0], original.violations[0].nodes[1].any[0].relatedNodes[0]);
});

test("preserves tag order and unfamiliar recorded tags while removing repeats", () => {
  const raw = observations();
  raw.violations[0].tags = ["future-standard", "cat.forms", "future-standard"];
  assert.deepEqual(mapAndValidate(raw)[0].tags, ["future-standard", "cat.forms"]);
  raw.url = "about:blank";
  assert.equal(mapAndValidate(raw)[0].url, "about:blank");
});
