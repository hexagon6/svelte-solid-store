# @hexagon6/svelte-solid-store

## Purpose

Using svelte & sveltekit is nice. Using solid (social linked data) should be nice too, so svelte-solid store gives you easy access to webId, username, preferencesFile, publicTypeIndex & privateTypeIndex to get you started.

## Usage (with sveltekit and ssr disabled)

1. Install with a package manager, e.g. npm : `npm i @hexagon6/svelte-solid-store`
2. Add it to your svelte component:

```svelte
// $lib/components/username.svelte
<script>
import {username} from '@hexagon6/svelte-solid-store'
</script>

Hello, my name is {$username}
```

3. Set a session in your page (example with @inrupt/solid-client-authn-browser -> ssr = false)

```javascript
// +page.js
import { session } from "@hexagon6/svelte-solid-store";
import { browser } from "$app/environment";
import {
  handleIncomingRedirect,
  getDefaultSession,
} from "@inrupt/solid-client-authn-browser";

export async function load({ url }) {
  if (browser) {
    await handleIncomingRedirect({
      url: url.href,
      restorePreviousSession: true,
    });
    session.set(getDefaultSession());
  }
}

export const ssr = false;
```

```svelte
// +page.svelte
<script>
  import { page } from '$app/stores'
  import { login, logout } from '@inrupt/solid-client-authn-browser'
  import { session } from '@hexagon6/svelte-solid-store'
  import Username from '$lib/components/username.svelte'

  // change this to your pod
  let oidcIssuer = 'https://yoursolidpod.local'

  const handleLogin = () => {
    login({
      // make sure you make oidcIssuer (=pod Url) user-configurable
      oidcIssuer: oidcIssuer,
      // solid pod will redirect to current page after login
      redirectUrl: $page.url.href,
      // clientName is what your pod will show you
      clientName: 'Your Sveltekit App Name',
    })
  }

  const handleLogout = () => {
    logout()
    session.set(null)
  }
</script>

svelte-solid-store
<div>
  <input bind:value={oidcIssuer} />
  <button on:click={handleLogin}>Login</button>
  <button on:click={handleLogout}>Logout</button>
</div>
<Username />
```
