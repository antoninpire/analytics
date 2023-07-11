/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("$lib/server/lucia.js").Auth;
  type UserAttributes = {
    email: string;
  };
}
