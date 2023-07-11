// @ts-nocheck

"use client";

import { useEffect } from "react";
const COOKIE_NAME = "session-id";

export default function ClientPage() {
  useEffect(() => {
    localStorage.setItem("session-start", new Date().toISOString());

    window.onunload = function () {
      fetch("/api/test", {
        method: "post",
        body: JSON.stringify({
          date: new Date(localStorage.getItem("session-start")).getTime(),
        }),
      });
    };
  }, []);

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
    // _setSessionId();

    // const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // const country = timezones[timezone];
    // const locale =
    //   navigator.languages && navigator.languages.length
    //     ? navigator.languages[0]
    //     : navigator.userLanguage ||
    //       navigator.language ||
    //       navigator.browserLanguage ||
    //       "en";

    // const body = {
    //   timestamp: new Date().toISOString(),
    //   action: "PAGE_HIT",
    //   session_id: _getSessionId(),
    //   user_agent: window.navigator.userAgent,
    //   locale,
    //   location: country,
    //   referrer: document.referrer,
    //   pathname: window.location.pathname,
    //   href: window.location.href,
    //   sessionDuration:
    //     new Date().getTime() -
    //     new Date(localStorage.getItem("session-start")).getTime(),
    // };

    // fetch("/api/test", {
    //   method: "post",
    //   body: JSON.stringify(body),
    // });

    // localStorage.clear();

    // console.log(body);

    const body = {
      session_id: "211ea4dd-0248-46f0-b56d-f38e2f38a917",
      user_agent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      locale: "en-US",
      location: "FR",
      referrer: "",
      pathname: "/Users/antonin/work/analytics/src/test.html",
      href: "file:///Users/antonin/work/analytics/src/test.html?hello=query",
      browser: "Google Chrome",
      os: "macOS",
      device: "Desktop",
      queryParams: {
        hello: "query",
      },
      duration: 30,
      timestamp: new Date().toISOString(),
      website_token: "hello_world",
    };

    fetch("/api/analytics", {
      method: "post",
      body: JSON.stringify(body),
    });
  }
  return <button onClick={handleClick}>Click me</button>;
}
