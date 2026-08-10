import type { FieldContextArgs, FormResolvers, FormStore, UserConnection } from "@pipe0/base";
import { API_BASE_URL, ENVIRONMENT } from "./client";

export function makeResolvers(): FormResolvers {
  return {
    getConnections: async ({ id, publicIds }) => {
      const res = await fetch(`${API_BASE_URL}/pipes/connections`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          pipe_id: id,
          environment: ENVIRONMENT,
          ...(publicIds && publicIds.length > 0 ? { public_ids: publicIds } : {}),
        }),
      });
      if (!res.ok) throw new Error(`connections failed (${res.status})`);
      const data = (await res.json()) as { items: UserConnection[] };
      return data.items;
    },

    getFieldContext: async (args: FieldContextArgs): Promise<FormStore> => {
      const res = await fetch(`${API_BASE_URL}/pipes/field-context`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          field_path: args.fieldPath,
          query: args.query,
          payload: args.payload,
          environment: ENVIRONMENT,
        }),
      });
      if (!res.ok) throw new Error(`field-context failed (${res.status})`);
      return (await res.json()) as FormStore;
    },
  };
}
