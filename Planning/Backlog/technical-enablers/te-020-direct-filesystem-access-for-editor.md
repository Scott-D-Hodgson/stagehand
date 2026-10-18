# TE-020 — Add direct filesystem access to the editor

**Status:** Later candidate  
**Priority:** Later

## Intent

After the upload/import and download/export editor workflow is established, consider adding direct filesystem access so users can open and save plan files through browser file pickers.

## Possible capabilities

- Open a plan and its referenced case files from a user-selected file or directory.
- Save changes back to user-selected files after an explicit permission grant.
- Detect unavailable APIs or denied/revoked permissions and fall back to upload/import and download/export.
- Document secure-context requirements, permission behaviour, and supported-browser differences.

## Constraints

- This is not part of the MVP.
- Direct filesystem access must remain optional; the editor's upload/import and download/export workflow remains supported.
- Do not access files without explicit user selection and permission.

## Dependencies

- ATR-029 MVP editor workflow
- A selected browser support matrix and implementation review
