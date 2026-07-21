# Google Drive sync setup

Cloud sync backs up your workout data to a private, app-only file in your
Google Drive (using the `drive.appdata` scope, so it never shows up in your
regular Drive UI). It's manual — you trigger it from the "Sync now" button in
Profile or right after finishing a workout.

To enable it, you need your own Google OAuth Client ID:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and
   create (or select) a project.
2. Enable the **Google Drive API** for that project (APIs & Services →
   Library).
3. Configure the **OAuth consent screen** (APIs & Services → OAuth consent
   screen):
   - User type: External.
   - Add the `drive.appdata` scope.
   - Publishing status: Testing is fine for personal use — add your own
     Google account under "Test users" so you don't need Google's full
     verification review.
4. Create an **OAuth 2.0 Client ID** (APIs & Services → Credentials → Create
   Credentials → OAuth client ID):
   - Application type: Web application.
   - Authorized JavaScript origins: add your GitHub Pages origin (e.g.
     `https://<username>.github.io`) and `http://localhost:5173` for local
     development.
   - No redirect URI is needed — this app uses the Google Identity Services
     token-client flow, not a redirect-based flow.
5. Copy the generated Client ID into a `.env` file at the repo root (see
   `.env.example`):
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```
6. Restart the dev server (or rebuild) so Vite picks up the new env var.

## Notes

- Access tokens last about an hour and aren't silently refreshed, so you may
  see a Google sign-in prompt each time you sync — that's expected for a
  manual, on-demand feature.
- The backup lives in your Drive's hidden "app data" folder, so it won't
  clutter your visible Drive, but it also isn't something you can browse to
  and download directly from drive.google.com.
