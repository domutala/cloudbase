import { Logger } from "@nestjs/common";
import waitlist from "./waitlist";
import * as nodemailer from "nodemailer";

export default {
  async send(
    phonenumber: string,
    text: string,
    options: { [x: string]: any } = {},
  ) {
    const isProduction = process.env.NODE_ENV === "production";
    if (isProduction) {
      if (process.env.npm_package_version.startsWith("beta")) {
        const waiter = waitlist[phonenumber];
        if (waiter) {
          const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
              pass: process.env.EMAIL_PASSWORD,
              user: process.env.EMAIL_USER,
            },
          });

          try {
            const info = await transporter.sendMail({
              from: `"digibank 👻" <${process.env.EMAIL_USER}>`, // sender address
              to: [waiter.email, "ibntalla@gmail.com"],
              ...options.email,
            });
          } catch (error) {
            console.log(error);
          } finally {
            transporter.close();
          }
        }
      } else {
        // send sms
      }
    } else Logger.log(text);
  },

  async otp(phonenumber: string, otp: string) {
    const message = `${otp} est votre code de validation`;
    const text = `${otp} est votre code de validation`;

    return await this.send(phonenumber, message, {
      email: { subject: message, text },
    });
  },
};
