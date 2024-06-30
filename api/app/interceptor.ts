import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { SessionRepository } from "database/repositorys/Session";
import { Request } from "express";
import { catchError, map, Observable, throwError } from "rxjs";
import forge from "utils/forge";
import * as dayjs from "dayjs";

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  constructor() {}

  @Inject() private sessionRepository: SessionRepository;

  async decodeSession(token?: string) {
    if (!token) return;
    token = token.split(" ").pop();

    const session = await this.sessionRepository._findOne({ id: token });
    return session;
  }

  private fyleDecrypter(obj?: { [key: string]: any }) {
    function _decrypter(datas: any) {
      if (!datas) {
        // ne rien faire
      } else if (Array.isArray(datas)) {
        for (let i = 0; i < datas.length; i++) {
          datas[i] = _decrypter(datas[i]);
        }
      } else if (Object.prototype.toString.call(datas) === "[object Object]") {
        if ("_FILE_" in datas) datas = datas._FILE_;
        else {
          for (const key in datas) {
            datas[key] = _decrypter(datas[key]);
          }
        }
      }

      return datas;
    }

    return _decrypter(obj);
  }

  _throwError(error: any) {
    if (process.env.NODE_ENV !== "production") {
      Logger.error(error);
    }

    if (error instanceof HttpException) return throwError(error);

    if (typeof error === "string") {
      return throwError(new HttpException(error, HttpStatus.BAD_REQUEST));
    }

    return throwError(
      new HttpException("internal_error", HttpStatus.INTERNAL_SERVER_ERROR),
    );
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    request.session = await this.decodeSession(request.headers.authorization);

    if (request.session) {
      if (["disconnected"].includes(request.session.status)) {
        return this._throwError(
          new HttpException(
            `session_is_${request.session.status}`,
            HttpStatus.UNAUTHORIZED,
          ),
        );
      }

      request.session = await this.sessionRepository._update({
        id: request.session.id,
        lastUseAt: new Date(),
      });
    }

    if (!request.path.startsWith("/api/session/init") && request.path !== "/") {
      if (!request.session) {
        return this._throwError(
          new HttpException("session_is_required", HttpStatus.UNAUTHORIZED),
        );
      }
    }

    // vérifier que la session est valide
    if (request.path.startsWith("/api/console")) {
      if (!request.session || !request.session.user) {
        return this._throwError(
          new HttpException(
            "session_valid_is_required",
            HttpStatus.UNAUTHORIZED,
          ),
        );
      }
    }

    if (request.body && request.session) {
      request.body = this.fyleDecrypter(forge.session.decrypter(request.body));
    }

    return next.handle().pipe(
      map((data) => {
        if (request.session) {
          data = forge.session.encrypter(data, request.session.publicKey);
        }
        return data;
      }),
      catchError((error) => this._throwError(error)),
    );
  }
}
