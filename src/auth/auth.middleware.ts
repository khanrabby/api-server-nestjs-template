import { Injectable, Logger, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { decode, JwtPayload, verify } from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwk: { keys: PublicKey[] } = require(`../../${process.env.JKS_FILE}.json`);

interface CognitoToken extends JwtPayload {
  sub: string;
  "cognito:groups": string[];
}
interface PublicKey {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}

export interface User {
  id: string;
  groups: string[];
}

const pemMap = jwk.keys.reduce((result: { [key: string]: string }, key) => {
  const pem = jwkToPem(key as jwkToPem.JWK);
  result[key.kid] = pem;
  return result;
}, {});

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  private verifyJwt(token: string, accessPem?: string): CognitoToken {
    if (accessPem === undefined) {
      this.logger.log("user not exist in JWT");
      throw new UnauthorizedException("Invalid Token");
    }
    try {
      return verify(token, accessPem, { algorithms: ["RS256"] }) as CognitoToken;
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        this.logger.log("Expired Token");
      } else {
        this.logger.log("Error resolving token:", err);
      }
      throw new UnauthorizedException(err.message);
    }
  }

  private getKeyId(token: string): string {
    const decodedToken = decode(token, { complete: true });
    if (!decodedToken || !decodedToken.header.kid) {
      this.logger.log("Invalid JWT format");
      throw new UnauthorizedException("Invalid Token");
    }
    return decodedToken.header.kid;
  }

  public use(req: any, _: any, next: (error?: unknown) => void) {
    const token = req.headers["authorization"] as string;

    try {
      if (!token) {
        this.logger.log("No token provided");
        throw new UnauthorizedException("No token provided");
      }

      console.log('req headers = ', req.headers);

      if (req.headers.requesttype && req.headers.requesttype == 'server_cron') {
        console.log('inside req.header.requestType block');
        // check the
        if (req.originalUrl.includes('dataset/bulkInsert')) {
          // verify the access token
          if (token == process.env.CRON_JOB_TOKEN) {
            next();
          }
          else throw new UnauthorizedException('Invalid Token');
        }
      }
      else {
        const keyId = this.getKeyId(token);
        const decoded = this.verifyJwt(token, pemMap[keyId]);
        const groups = decoded["cognito:groups"];
        let userId = decoded.sub;
        // handle special account switching for admin users who request an account of another user
        if (groups && groups.includes("admin")) {
          if (req.headers["x-user-id"]) {
            userId = req.headers["x-user-id"] as string;
            this.logger.log(`Admin user: ${decoded.sub} is impersonating ${userId}`);
          }
        }
        req.user = {
          userId: userId,
          groups: groups,
        };
        next();
      }
    } catch (error: unknown) {
      // To end the request lifecycle we need to call next even if we throw an exception during the process.
      next(error);
    }
  }
}
