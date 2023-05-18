import { __, curry, pipe as _ } from "ramda";
import { derived, writable } from "svelte/store";
import {
  getSolidDataset,
  getStringNoLocale,
  getThing,
  getNamedNode,
} from "@inrupt/solid-client";
import { SOLID, WS } from "@inrupt/vocab-solid";
import { VCARD } from "@inrupt/vocab-common-rdf";

export const pod = writable();

export const session = writable();

export const webId = derived(session, async ($session, set) => {
  if ($session?.info.isLoggedIn) {
    const { info } = $session;
    const webIdDataset = await getSolidDataset(info?.webId, {
      fetch: $session.fetch,
    });

    const thing = curry(getThing)(__, info.webId);

    set(_(thing)(webIdDataset));
  } else {
    set(undefined);
  }
});

/*
  username is undefined if not logged in
  username is null if no name has been set
  username is string if name has been set in webId
*/
export const username = derived(
  webId,
  ($webId) => {
    if ($webId) {
      const name = curry(getStringNoLocale)(__, VCARD.fn);

      return _(name)($webId);
    } else {
      return undefined;
    }
  },
  ""
);

const namedNodeFromWebId = (/** @type {string} */ type) => (webId) => {
  if (!webId) {
    return null;
  }
  const index = curry(getNamedNode)(__, type);

  const result = _(index)(webId);
  return result ? result.value : null;
};

export const publicTypeIndex = derived(
  webId,
  namedNodeFromWebId(SOLID.publicTypeIndex)
);
export const privateTypeIndex = derived(
  webId,
  namedNodeFromWebId(SOLID.privateTypeIndex)
);
export const spaceStorage = derived(webId, namedNodeFromWebId(WS.storage));
