import Resolver from "@forge/resolver";
const resolver = new Resolver();

resolver.define("event-listener", async ({ payload, context }) => {
  console.log(payload);
});

export const handler = resolver.getDefinitions();
