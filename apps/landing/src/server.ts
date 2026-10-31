import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

export default createServerEntry({
  fetch(request, opts) {
    return handler.fetch(request, opts);
  },
});
