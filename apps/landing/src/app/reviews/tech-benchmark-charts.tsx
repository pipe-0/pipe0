import { Cell, Cells, Fill, Frame, Row } from "./list-benchmark-charts";
import { pct, TECH_BENCHMARK_PERIOD, TECH_LOOKUPS, TECH_VERTICALS } from "./tech-benchmark";

/**
 * DataForSEO against BuiltWith for technology lookups, for review MDX: `<TechBenchmark />`.
 * One chart: per vertical, the share of prospecting categories in which each tool found a
 * technology. DataForSEO is the reviewed tool (indigo), BuiltWith the comparison (amber).
 */
export function TechBenchmark() {
  return (
    <Frame
      title="Tech-stack categories found on the same 20 websites"
      period={TECH_BENCHMARK_PERIOD}
      caption={`A category counts when the tool found at least one technology in it, e.g. a CRM, a payment provider or an email tool. BuiltWith counted only technologies it marks live. DataForSEO couldn't look up ${TECH_LOOKUPS.dataforseo.empty} of the ${TECH_LOOKUPS.domains} websites because they redirect.`}
    >
      <Cells>
        {TECH_VERTICALS.map((v) => {
          const dfs = pct(v.dataforseo, v.checks);
          const bw = pct(v.builtwith, v.checks);
          return (
            <Cell key={v.key} heading={v.label}>
              <Row
                label="DataForSEO"
                strong
                wide
                value={`${dfs}%`}
                title={`DataForSEO found a technology in ${v.dataforseo} of ${v.checks} category checks`}
              >
                <Fill to={dfs / 100} skin="win" />
              </Row>
              <Row
                label="BuiltWith"
                wide
                value={`${bw}%`}
                title={`BuiltWith found a technology in ${v.builtwith} of ${v.checks} category checks`}
              >
                <Fill to={bw / 100} skin="lose" />
              </Row>
            </Cell>
          );
        })}
      </Cells>
    </Frame>
  );
}
