# Siri Phone Capture Setup

This setup lets Siri append notes to `docs/notes/NOTES_FROM_PHONE.md` automatically.

## 1) Create a GitHub token (iPhone)
- Create a fine-grained personal access token for this repo.
- Required permissions:
  - Repository permissions -> `Contents: Read and write`
  - Repository permissions -> `Metadata: Read`

## 2) Create iPhone Shortcut
Create a Shortcut named `TaskMaster Capture` with:

1. `Dictate Text` (or `Ask for Input`)
2. `Get Contents of URL`
   - URL: `https://api.github.com/repos/gregorynallie/taskmaster/dispatches`
   - Method: `POST`
   - Headers:
     - `Authorization`: `Bearer <YOUR_TOKEN>`
     - `Accept`: `application/vnd.github+json`
     - `X-GitHub-Api-Version`: `2022-11-28`
   - Request Body (JSON):
```json
{
  "event_type": "phone_note_capture",
  "client_payload": {
    "note": "<DICTATED_TEXT>",
    "type": "brain_dump",
    "source": "iphone-siri"
  }
}
```
3. Optional: `Show Notification` -> "Saved to TaskMaster phone notes"

Then invoke by saying: "Hey Siri, TaskMaster Capture."

## 3) What happens next
- GitHub Actions appends the note to `docs/notes/NOTES_FROM_PHONE.md` as an unchecked item.
- During normal chat, the assistant auto-triages unchecked notes into:
  - `CONCEPT.md`
  - `TODO`
  - `IDEAS_BACKLOG.md`
- After triage, notes are marked processed and you get a short summary of where each note went.
