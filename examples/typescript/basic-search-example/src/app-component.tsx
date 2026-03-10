import { SearchSection } from "./search-section";

const searchSections = [
  {
    title: "Search for leads with Crustdata",
    description:
      "Uses the Icypeas dataset to find software engineers in San Francisco and New York",
    searchType: "icypeas",
    emoji: "🔍",
    payload: {
      search: {
        search_id: "people:profiles:crustdata@1",
        config: {
          limit: 5,
          filters: {
            current_employers_website_urls: {
              include: ["https://microsoft.com"],
            },
          },
        },
      },
    },
  },
] satisfies {
  title: string;
  description: string;
  searchType: string;
  emoji: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                payload={section.payload as any}
                emoji={section.emoji}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
