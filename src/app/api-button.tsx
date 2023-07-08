// @ts-nocheck

"use client";

import timezones from "./timezones.json";

const COOKIE_NAME = "session-id";

export default function ApiButton() {
  function _getSessionId() {
    let cookie = {};
    document.cookie.split(";").forEach(function (el) {
      let [key, value] = el.split("=");
      cookie[key.trim()] = value;
    });
    return cookie[COOKIE_NAME];
  }

  function _uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  function _setSessionId() {
    /**
     * Try to keep same session id if session cookie exists, generate a new one otherwise.
     *   - First request in a session will generate a new session id
     *   - The next request will keep the same session id and extend the TTL for 30 more minutes
     */
    const sessionId = _getSessionId() || _uuidv4();
    let cookieValue = `${COOKIE_NAME}=${sessionId}; Max-Age=1800; path=/; secure`;

    //   if (domain) {
    //       cookieValue += `; domain=${domain}`
    //   }

    document.cookie = cookieValue;
  }

  async function handleClick() {
    _setSessionId();

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const country = timezones[timezone];
    const locale =
      navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.userLanguage ||
          navigator.language ||
          navigator.browserLanguage ||
          "en";

    const body = {
      timestamp: new Date().toISOString(),
      action: "PAGE_HIT",
      session_id: _getSessionId(),
      user_agent: window.navigator.userAgent,
      locale,
      location: country,
      referrer: document.referrer,
      pathname: window.location.pathname,
      href: window.location.href,
    };

    const res = await fetch("/api/event", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = await res.json();
  }

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Click me!
    </button>
  );
}
