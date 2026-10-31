import { createIsomorphicFn } from "@tanstack/react-start";
import { found, readData } from "./static-data";

export const getLegalPage = createIsomorphicFn()
  .server(async (slugs: string[]) => {
    const { legalPageData } = await import("./legal-versions.server");
    return found(legalPageData(slugs));
  })
  .client((slugs) => readData("legal", ...slugs));

export const getLatestLegalUrl = createIsomorphicFn()
  .server(async (family: string) => {
    const { latestLegalVersion } = await import("./legal-versions.server");
    return found(latestLegalVersion(family)).url;
  })
  .client((family) => readData("legal-latest", family));
