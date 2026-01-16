---
allowed-tools: Bash(s3cmd:*), Bash(node --experimental-strip-types:*)
description: Re-scrape a tournament by pulling from S3, removing, re-pulling, and pushing back
argument-hint: <TID>
---

Re-scrape a tournament from TopDeck.gg and update the S3 database.

The tournament TID is: $ARGUMENTS

Follow these steps in order:

1. **Pull the database from S3**:
   ```
   s3cmd get s3://edhtop16/edhtop16.db --force
   ```

2. **Remove the tournament from the local database**:
   ```
   node --experimental-strip-types scripts/remove-tournament.ts --tid <TID>
   ```

3. **Re-scrape the tournament from TopDeck.gg**:
   ```
   node --experimental-strip-types scripts/pull-database.ts --tid <TID>
   ```

4. **Ask for confirmation** before pushing to S3. Summarize what was done and ask the user to confirm they want to push the changes.

5. **Push the updated database back to S3** (only after user confirms):
   ```
   s3cmd put edhtop16.db s3://edhtop16
   ```

Report the results of each step to the user. If any step fails, stop and report the error.
