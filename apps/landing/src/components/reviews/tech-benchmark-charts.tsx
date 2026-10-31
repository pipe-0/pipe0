import { Cell, Cells, Fill, Frame, Row } from "./list-benchmark-charts";
import {
  pct,
  TECH_BENCHMARK_PERIOD,
  TECH_LOOKUPS,
  TECH_TOOL_NAMES,
  TECH_TOOLS,
  TECH_VERTICALS,
  type TechTool,
} from "./tech-benchmark";

/**
 * Technology lookups compared, for review MDX: `<TechBenchmark highlight="builtwith" />`. One
 * chart: per vertical, the share of prospecting categories in which each tool found a
 * technology. The reviewed tool comes first in indigo, the others in amber.
 */
export function TechBenchmark({ highlight }: { highlight?: TechTool }) {
  const ordered = highlight
    ? [highlight, ...TECH_TOOLS.filter((t) => t !== highlight)]
    : TECH_TOOLS;
  return (
    <Frame
      title="Tech-stack categories found on the same 20 websites"
      period={TECH_BENCHMARK_PERIOD}
      caption={`A category counts when the tool found at least one technology in it, e.g. a CRM, a payment provider or an email tool. BuiltWith counted only technologies it marks live; Amplemarket has no detection dates and listed conflicting shop platforms for ${TECH_LOOKUPS.tools.amplemarket.conflictingPlatforms} of ${TECH_LOOKUPS.stores} stores. DataForSEO couldn't look up ${TECH_LOOKUPS.tools.dataforseo.empty} websites that redirect.`}
    >
      <Cells>
        {TECH_VERTICALS.map((v) => (
          <Cell key={v.key} heading={v.label}>
            {ordered.map((t) => {
              const share = pct(v.found[t], v.checks);
              const self = !highlight || t === highlight;
              return (
                <Row
                  key={t}
                  label={TECH_TOOL_NAMES[t]}
                  strong={t === highlight}
                  wide
                  value={`${share}%`}
                  title={`${TECH_TOOL_NAMES[t]} found a technology in ${v.found[t]} of ${v.checks} category checks`}
                >
                  <Fill to={share / 100} skin={self ? "win" : "lose"} />
                </Row>
              );
            })}
          </Cell>
        ))}
      </Cells>
    </Frame>
  );
}
