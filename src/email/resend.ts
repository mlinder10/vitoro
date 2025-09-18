import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY!);

var resend: Resend | null;

function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY!);
  return resend;
}

export default getResend;
