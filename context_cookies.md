# Context Cookies - Relay Context With Custom Site Preference Cookies

This document outlines a quick stack overview and outlines the changes by @pugpartylife to prototype relay-context cookies for the edhtop16 site.

## Stack overview

### Frontend

1) React
2) Relay - GraphQL client - context/query optimization
3) Tailwind - CSS utility classes
4) Vite - ease of development
5) River Router - CUSTOM (see other doc?)
6) Type-safe - TS compliant

### Backend

1) Pothos - Schema building for type safe GQL
2) GraphQL Yoga - Schema-first, eats pothos schema.
3) Node/Express - Runtime
4) Kysely - Type-safe queries
5) sqlite3 - Fits within container image, doesn't require external DB server.
6) SSR - Performance, SEO (come find me easily please!)

### Simple Cookies

1) [Client Side](src/lib/client/cookies.ts)
2) [Server Side](src/lib/server/cookies.ts)
3) [Shared Cookie Utilities](src/lib/shared/cookie-utils.ts)
4) [Shared Preference Types](src/lib/shared/preferences-types.ts)
5) [Entry Client](src/entry-client.tsx)
6) [Relay Client Environment](src/lib/client/relay_client_environment.ts)

### Relay Context

1) [Relay Client Environment](src/lib/client/relay_client_environment.ts)
2) [Context](src/lib/server/context.ts)
3) [Entry Server](entry-server.tsx)

### Summary of All Changes (I think...)

1) Add server and client cookies.
2) Add shared preferences and cookie utilities.
3) Check for window preferences from entry-client. (can probably remove this now)
4) Yoga now uses createRelayContext to centralize preferences.
5) Pothos uses context.params instead of args.
6) Resolves can now read from context.relayContext.
7) Preference variables are no longer required for GQL queries.

### What to do next?

1) Migrate args to context in schema files.
2) Replace URL based updates with `usePreferences` in pages. This removes URL param requirements.
   - Example:
  ```const { preferences, updatePreference } = usePreferences('commanders', {...})```.
   - Replace `replaceRoute` with `updatePreferences`.
   - JIC `context.relayContext?.preferences?.[pageKey]`
4) Update GQL queries. Preference vars no longer needed (shouldn't be needed...) with context.
5) Remove entrypoint `parse(params)`. All vars come from context now.
6) Check for hydration fixes. These changes should automatically fix the hydration issues (I think...).
7) Do some testing to make sure we're all gucci.
