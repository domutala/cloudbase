import { Controller, Get, Query } from "@nestjs/common";
import axios from "axios";

@Controller("/")
export class AppController {
  @Get()
  async main(@Query("code") code) {
    const CLIENT_ID = process.env.GH_BASIC_CLIENT_ID;
    const CLIENT_SECRET = process.env.GH_BASIC_SECRET_ID;

    if (code) {
      const response = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: code,
        },
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      console.log(response.data);

      return { code };
    }

    return { client_id: CLIENT_ID };
  }
}
