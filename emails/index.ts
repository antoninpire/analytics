import { JSXElementConstructor, ReactElement } from "react";
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  email,
  subject,
  react,
}: {
  email: string | string[];
  subject: string;
  react: ReactElement<any, string | JSXElementConstructor<any>>;
}) => {
  return resend.emails.send({
    from: "Antonin <analytics@antonin.dev>",
    to: email,
    subject,
    react,
  });
};
