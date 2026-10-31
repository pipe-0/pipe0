type Operation = { id: string; label: string; body: string };

/**
 * Each product is its own provider and OAuth connection. Logos are the
 * provider icons from the catalog.
 */
export const googleWorkspaceProducts: {
  name: string;
  logo: string;
  summary: string;
  operations: Operation[];
}[] = [
  {
    name: "Google Sheets",
    logo: "https://imagedelivery.net/3B3AWuP94-S3Ro5eEac6JA/aebcd41d-4e42-4f44-926f-b1e5bfefa300/icon",
    summary:
      "Read rows from a spreadsheet and write results back to it. You name the spreadsheet by its URL.",
    operations: [
      {
        id: "rows:googlesheets@1",
        label: "Import a tab",
        body: "Bring a tab's rows into a pipe0 sheet, with columns from its header row.",
      },
      {
        id: "row:append:googlesheets@1",
        label: "Add rows",
        body: "Append each record as a new row, mapped to the tab's columns.",
      },
      {
        id: "rows:update:googlesheets@1",
        label: "Update rows",
        body: "Update every row that matches a condition, or add one when none does.",
      },
      {
        id: "row:findfirst:googlesheets@1",
        label: "Find a row",
        body: "Look up the first matching row, keyed by column name.",
      },
      {
        id: "rows:find:googlesheets@1",
        label: "Find rows",
        body: "Return every matching row and the total match count.",
      },
    ],
  },
  {
    name: "Gmail",
    logo: "https://imagedelivery.net/3B3AWuP94-S3Ro5eEac6JA/8da8ab6b-7f7e-4c42-6abf-212ea537db00/icon",
    summary:
      "Send or draft the emails your workflow writes, from your own address.",
    operations: [
      {
        id: "email:send:gmail@1",
        label: "Send email",
        body: "Send one email per record from your Gmail address.",
      },
      {
        id: "email:draft:gmail@1",
        label: "Create a draft",
        body: "Put a draft in your Gmail for you to review. Nothing is sent.",
      },
    ],
  },
  {
    name: "Google Calendar",
    logo: "https://imagedelivery.net/3B3AWuP94-S3Ro5eEac6JA/9cfc8918-2046-47dd-52f9-353ce76fd800/icon",
    summary: "Turn meetings into rows, and book events from them.",
    operations: [
      {
        id: "events:googlecalendar@1",
        label: "List events",
        body: "One row per event, with attendees, times, and the meeting link.",
      },
      {
        id: "event:create:googlecalendar@1",
        label: "Create events",
        body: "Create an event per record, with attendees and an optional Google Meet link.",
      },
    ],
  },
];
