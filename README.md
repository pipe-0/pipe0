# Add clay-like data enrichment to any application. Fast.

[Pipe0](https://pipe0.com) is a framework for data enrichment. If you have some data about a person or company
but want more, you can do that in an infinite number of ways with pipe0.

The ability to enrich data is a requirement for many apps. You may dream of a
CRM that updates itself or a sales copilot helping SDRs prepare for upcoming meetings. Data enrichment
enables these features but is surprisingly hard to build.

At pipe0, we're on a mission to build the fastest, most extensible data enrichment framework in the world.

Here are some things pipe0 does for you:

🔌 Connect 50+ data providers <br />
💨 Analyze enrichment pipelines and parallelize execution (we're fast!)<br />
💰 Run enrichment, scraping and AI infrastructure at low cost (we take 0% margin on external providers)<br />

## What makes a framework?

The term `framework` may surprise you because pipe0 is an API, dashboard, and SDK.

While you can perform powerful enrichments in just 10 lines of code, you can choose to express logic and direction of data flow
with it, too. The ability to design custom enrichment flows, add logic, and change them on the fly makes pipe0 a framework.

The following is an example of an enrichment flow that requires logic.

```text filename="Flow that needs logic"
FIND phone number of person
IF found
    FIND website of current employer
IF NOT found
    FIND work email address
```

Your first instinct might be to implement this with code. However, pipe0 offers a much simpler way to express this
and removes brittle spaghetti code once and for all.

## Useful links

- [Website](https://pipe0.com)
- [Documentation](https://pipe0.com/resources/documentation/introduction)
- [Clay vs pipe0](https://pipe0.com/resources/documentation/pipe0-vs-clay)
