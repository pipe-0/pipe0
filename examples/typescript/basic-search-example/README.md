# Pipe0 Search API Demo

A React + TypeScript example demonstrating how to use the Pipe0 Search API with TanStack Query for lead generation and prospecting.

## 🚀 Features

- **Three Search Types**: Icypeas, Clado, and combined dataset searches
- **Live Code Examples**: View the actual API requests being made

## 📋 Prerequisites

- Node.js 16+

## 🎯 What This Demo Shows

### 1. **Search with Icypeas** 🔍

- Uses structured filters (job titles, locations)
- Great for targeted searches with specific criteria
- Example: Find software engineers in San Francisco and New York

### 2. **Search with Clado** 🤖

- Uses natural language queries powered by AI
- Perfect for conversational search queries
- Example: "software engineer at startup"

### 3. **Combined Search** 🔄

- Combines multiple datasets in one request
- Automatic deduplication across providers
- Cost-efficient way to get comprehensive results

## 🎮 Usage

1. **Start your development server:**

   ```bash
   pnpm run dev
   ```

2. **Open the app** and click any search button

3. **View results** in real-time with loading states

4. **Inspect code** using the "Show Request Code" buttons

## 🔍 Search Examples

### Icypeas Search

```javascript
{
  "searches": [{
    "search_id": "people:profiles:icypeas@1",
    "config": {
      "limit": 5,
      "filters": {
        "currentJobTitle": {
          "include": ["Software Engineer", "Developer"]
        },
        "location": {
          "include": ["San Francisco", "New York"]
        }
      }
    }
  }]
}
```

### Clado Search

```javascript
{
  "searches": [{
    "search_id": "people:profiles:clado@1",
    "config": {
      "limit": 5,
      "filters": {
        "query": "software engineer at startup"
      }
    }
  }]
}
```

## 📚 Learn More

- **Pipe0 Documentation**: [docs.pipe0.com](https://pipe0.com/docs)
- **Search Catalog**: [pipe0.com/resources/search-catalog](https://pipe0.com/resources/search-catalog)
- **TanStack Query**: [tanstack.com/query](https://tanstack.com/query)

## 📄 License

MIT License - feel free to use this code in your own projects!
