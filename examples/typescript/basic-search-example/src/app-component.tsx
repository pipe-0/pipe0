import type { SearchesRequestPayload } from "@pipe0/ops";
import { SearchSection } from "./search-section";

const searchSections = [
  {
    title: "Search for leads with Icypeas",
    description:
      "Uses the Icypeas dataset to find software engineers in San Francisco and New York",
    searchType: "icypeas",
    emoji: "🔍",
    payload: {
      config: {
        environment: "sandbox",
        dedup: {
          strategy: "default",
        },
      },
      searches: [
        {
          search_id: "people:profiles:icypeas@1",
          config: {
            limit: 5,
            filters: {
              currentJobTitle: {
                include: ["Software Engineer", "Developer"],
              },
              location: {
                include: ["San Francisco", "New York"],
              },
            },
          },
        },
      ],
    },
  },
  {
    title: "Search for leads with Clado",
    description:
      "Uses the Clado dataset with natural language query for startup software engineers",
    searchType: "clado",
    emoji: "🤖",
    payload: {
      config: {
        environment: "sandbox",
        dedup: {
          strategy: "default",
        },
      },
      searches: [
        {
          search_id: "people:profiles:clado@1",
          config: {
            limit: 5,
            filters: {
              query: "software engineer at startup",
            },
          },
        },
      ],
    },
  },
  {
    title: "Search for leads with Icypeas and Clado in one request",
    description:
      "Combines both datasets in a single request with deduplication",
    searchType: "combined",
    emoji: "🔄",
    payload: {
      config: {
        environment: "sandbox",
        dedup: {
          strategy: "default",
        },
      },
      searches: [
        {
          search_id: "people:profiles:icypeas@1",
          config: {
            limit: 3,
            filters: {
              currentJobTitle: {
                include: ["Software Engineer"],
              },
            },
          },
        },
        {
          search_id: "people:profiles:clado@1",
          config: {
            limit: 3,
            filters: {
              query: "frontend developer",
            },
          },
        },
      ],
    },
  },
] satisfies {
  title: string;
  description: string;
  searchType: string;
  emoji: string;
  payload: SearchesRequestPayload;
}[];

export function App() {
  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Pipe0 Search API Demo
              </h1>
              <p className="text-slate-600">
                Demonstrate different ways to search for leads using Pipe0's API
              </p>
            </div>

            {searchSections.map((section) => (
              <SearchSection
                key={section.title}
                title={section.title}
                description={section.description}
                payload={section.payload}
                emoji={section.emoji}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
