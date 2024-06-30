import * as randomatic from "randomatic";
import forge from "./forge";

export default {
  generate() {
    const otp = randomatic("0", process.env.OTP_LENGTH || 6);
    const encrypted = forge.encrypter(otp);

    return {
      otp,
      encrypted: Array.isArray(encrypted) ? encrypted : [encrypted],
    };
  },
};
