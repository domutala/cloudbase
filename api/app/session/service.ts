import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { SessionRepository } from "database/repositorys/Session";
import { UserRepository } from "database/repositorys/User";
import { Request } from "express";
import forge from "utils/forge";
import axios from "axios";

@Injectable()
export class SessionService {
  constructor() {}

  @Inject(REQUEST) private request: Request;
  @Inject() private repository: SessionRepository;
  @Inject() private userRepository: UserRepository;

  async init(params: any) {
    if (!params.publicKey) throw "session.init.publicKey_is_required";
    try {
      forge.encrypter("test", params.publicKey);
    } catch (error) {
      throw "session.init.publicKey_is_incorrect";
    }

    let id: string;

    if (!this.request.session) {
      const session = await this.repository._create({
        publicKey: params.publicKey,
      } as any);
      id = session.id;
      this.request.session = session;
    } else {
      id = this.request.session.id;
    }

    if (process.env.NODE_ENV !== "production") Logger.log(id);

    return {
      id: { _RSA_ENCODED_: id },
      publicKey: forge.keys.public,
      status: this.request.session?.status,
      user: this.request.session?.provider
        ? await this.providerLogin(this.request.session.provider.token)
        : undefined,
    };
  }

  async providerLogin(access_token: string) {
    async function getEmail() {
      try {
        const url = `https://api.github.com/user/emails`;
        const response = await axios({
          url,
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        });

        const emails: {
          email: "ibntalla@gmail.com";
          primary: true;
          verified: true;
          visibility: "private";
        }[] = response.data;

        const i = emails.findIndex((email) => email.primary);
        if (i === -1) throw "login.provider.email_not_found";

        return emails[i].email;
      } catch (error) {
        throw error;
      }
    }

    const email = await getEmail();
    let user = await this.userRepository._findOne({ email });

    if (!user) {
      user = await this.userRepository._create({ email });
    }

    async function login() {
      try {
        const url = `https://api.github.com/user?access_token=${access_token}`;
        const response = await axios({
          url,
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        });

        return response.data;
      } catch (error) {
        console.log(error.response.data);

        throw error;
      }
    }

    const profile = await login();

    return { ...user, profile };
  }

  async login(params: { code: string; provider: string }) {
    async function getAccessToken() {
      try {
        const url = `https://github.com/login/oauth/access_token`;
        const response = await axios({
          url,
          method: "POST",
          data: {
            client_id: process.env.GH_BASIC_CLIENT_ID,
            client_secret: process.env.GH_BASIC_SECRET_ID,
            code: params.code,
          },
          headers: { Accept: "application/json" },
        });

        return response.data.access_token;
      } catch (error) {
        throw error;
      }
    }

    const access_token = await getAccessToken();

    async function getEmail() {
      try {
        const url = `https://api.github.com/user/emails`;
        const response = await axios({
          url,
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        });

        const emails: {
          email: "ibntalla@gmail.com";
          primary: true;
          verified: true;
          visibility: "private";
        }[] = response.data;

        const i = emails.findIndex((email) => email.primary);
        if (i === -1) throw "login.provider.email_not_found";

        return emails[i].email;
      } catch (error) {
        throw error;
      }
    }

    const email = await getEmail();
    let user = await this.userRepository._findOne({ email });

    if (!user) {
      user = await this.userRepository._create({ email });
    }

    async function login() {
      try {
        const url = `https://api.github.com/user?access_token=${access_token}`;
        const response = await axios({
          url,
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        });

        return response.data;
      } catch (error) {
        console.log(error.response.data);

        throw error;
      }
    }

    const profile = await login();

    const session = await this.repository._update({
      id: this.request.session.id,
      status: "connected",
      provider: { name: "github", token: access_token },
      user,
    });

    this.request.session = session;

    return { user: { ...user, profile }, status: this.request.session.status };
  }

  async logout() {
    if (this.request.session.status !== "connected") {
      throw "session.logout.session_cannot_be_logout";
    }

    const session = await this.repository._update({
      id: this.request.session.id,
      status: "disconnected",
    });

    this.request.session = session;

    return { status: this.request.session.status };
  }
}
