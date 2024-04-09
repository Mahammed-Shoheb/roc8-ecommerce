import { TOTP } from "totp-generator";
// import transporter from "./mail";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export default async function sendOTP(email: string, name: string) {
  const { otp, expires } = TOTP.generate("JBSWY3DPEHPK3PXPGFGKT", {
    digits: 8,
    period: 60 * 60,
  });
  // const mailOptions = {
  //   from: process.env.EMAIL_FROM,
  //   to: email,
  //   subject: "Your OTP - ECOMMERCE",
  //   text: `Your OTP is: ${otp}, OTP will expires in ${new Date(expires)}`,
  // };
  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log(`Email sent: ${info.response}`);
  //   }
  // });

  const mailerSend = new MailerSend({
    apiKey: process.env.API_KEY!,
  });

  const sentFrom = new Sender(process.env.EMAIL_USER!, "ECOMMERCE");

  const recipients = [new Recipient(email, email)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Your OTP - ECOMMERCE")
    .setText(
      `Dear ${name},

      Your OTP is: ${otp}, OTP will expires in ${new Date(expires).toLocaleDateString()}.
      
      Regards,
      ECOMMERCE APP
      
      `,
    );

  await mailerSend.email
    .send(emailParams)
    .then((res) => console.log(res))
    .catch((error) => console.log(error));
  return { otp, expires };
}
