# Publishing

pipe0 is listed in the OpenAI Plugins directory. ChatGPT and Codex share one directory, so one submission covers both. The package is MCP-only. Uploads are ZIP files, not repository links.

## One-time setup

1. At [platform.openai.com](https://platform.openai.com), give your account the **Apps Management: Write** permission (Settings > Organization > People > Roles).
2. Complete individual verification under Settings > Organization > General. The listing's developer name comes from this identity; `author.name` and `interface.developerName` in `.codex-plugin/plugin.json` must match it.
3. Create a dedicated reviewer account on pipe0: email and password sign-in, email already verified, no MFA, and its own organization with enough credits for the test cases (production calls bill). Production only accepts work email addresses at sign-up, so use an address on a company domain.

## Submit

1. Smoke-test first: in ChatGPT, turn on Developer mode, add `https://api.pipe0.com/v1/mcp` as a connector, finish the OAuth sign-in, and run the test cases below.
2. `node scripts/validate.mjs && node scripts/package.mjs`, then check `unzip -l dist/pipe0-<version>.zip`.
3. In the [Plugins dashboard](https://platform.openai.com/plugins), choose **Upload new or existing plugin**, select the verified identity, and upload the ZIP. Fix anything listed under **Metadata & Skills > Issues** and re-upload.
4. On the **MCPs** tab, select `pipe0` and click **Connect**. Confirm the URL and OAuth settings.
5. Domain verification: the portal shows a challenge token. Set it as `OPENAI_APPS_CHALLENGE` on the production core server, which serves it as plain text at `https://api.pipe0.com/.well-known/openai-apps-challenge`. Check with `curl`, then let the portal verify and scan the tools.
6. Under **Review information > Review details**, enter the reviewer credentials (dashboard only, never in the ZIP), the test cases, a demo recording URL, and release notes.
7. **Submit for review** and confirm the attestations. Feedback arrives by email. Once approved, open the approved version and click **Publish plugin**.

Test cases (initial review requires exactly five positive and three negative). Four are single stateless lookups and one writes a small sheet; the person lookups use the founder's own public profile.

| Kind | Description | Prompt | Tools triggered | Expected behavior |
|---|---|---|---|---|
| Positive | Work email from name and company | Find the work email of Florian Martens at pipe0.com | `run_pipes_oneshot` (`person:workemail:waterfall@1`) | Returns florian@pipe0.com |
| Positive | Company overview from domain | Give me a company overview of pipe0.com | `run_pipes_oneshot` (`company:overview@3`) | Returns a description, industry (Software Development), region (Berlin), headcount, and founding year |
| Positive | Email verification | Verify the email florian@pipe0.com with ZeroBounce | `run_pipes_oneshot` (`email:validate:zerobounce@1`) | Reports the status `valid` |
| Positive | People search | Find 5 Heads of Marketing in Berlin | `run_search_oneshot` (`people:profiles:crustdata@3`) | Returns 5 people with name, title, and LinkedIn URL |
| Positive | Company search saved to a sheet | Find 10 SaaS companies in Germany with 51 to 200 employees and save them to a new pipe0 sheet | `create_sheet`, `run_effects` (`search:run@1` with `companies:profiles:crustdata@3`) | Creates a sheet, adds 10 German SaaS companies as rows with name, domain, and LinkedIn URL, and returns the sheet link |
| Negative | Unrelated coding task | Write me a Python function that sorts a list | None | Answers directly without calling pipe0 tools |
| Negative | Unrelated general question | What is the capital of Australia? | None | Answers directly without calling pipe0 tools |
| Negative | Data pipe0 does not provide | Find the home address and date of birth of Florian Martens | None | Explains that pipe0 provides business contact and company data, not home addresses or dates of birth |

## Updates

- MCP server changes (tools, descriptions): deploy core, then **MCPs > Issues > Rescan**. No new ZIP is needed.
- Manifest, description, or asset changes: bump the version, rebuild the ZIP, and use **Upload plugin to make changes**, then submit again.
- The MCP server URL cannot be changed from the dashboard; contact OpenAI support.


## Release checklist

1. Bump `version` in `.codex-plugin/plugin.json` and add a `CHANGELOG.md` entry with the same version.
2. From `packages/openai-plugin`, run `node scripts/validate.mjs && node scripts/package.mjs`.
3. Commit, then tag: `git tag openai-plugin@<version> && git push --tags`. The prefix keeps the tag apart from the monorepo's npm package tags.
4. Upload the new ZIP as described under **Updates**.
