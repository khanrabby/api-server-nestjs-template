const configuration = process.env.NODE_ENV || "development";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({ path: `.env.${configuration}` });

import compression from "@fastify/compress";
import cors, { FastifyCorsOptions } from "@fastify/cors";
import { fastifyHelmet } from "@fastify/helmet";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import fs from "fs";
import { PinoLogger } from "nestjs-pino";
import { IS_PROD } from "./util/config";
import { AppModule } from "./app.module";

import { TagModule } from "./tag/tag.module";
import { HealthModule } from "./health/health.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  // configure error handling
  const httpAdapter = app.get(HttpAdapterHost);
  const logger = await app.resolve(PinoLogger);

  // configure compression
  app.register(compression, { encodings: ["gzip", "deflate"] });

  // cors
  let corsConfig: FastifyCorsOptions | undefined = undefined;
  console.log("IS_PROD = ", IS_PROD);
  if (IS_PROD) {
    corsConfig = {
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
      origin: function (
        origin: string,
        callback: (error: any, isValid: boolean) => void
      ) {
        if (!origin ||
          (origin.startsWith("https://") &&
            (origin.endsWith("vendidit.com") || origin === "*")) ||
          origin === "http://localhost:3000" ||
          origin === "http://localhost:4002"
        ) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException("CORS: Origin is not authorized"),
            false
          );
        }
      },
    };
  }
  app.register(cors, corsConfig);

  // helmet
  const helmetOptions = IS_PROD
    ? undefined
    : {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "validator.swagger.io"],
          scriptSrc: ["'self'", "https: 'unsafe-inline'"],
        },
      },
    };
  app.register(fastifyHelmet, helmetOptions);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      transform: true,
      whitelist: true,
    })
  );

  // needs to happen last - https://github.com/nestjs/swagger/issues/197
  if (IS_PROD) {
    // configure swagger
    const packageDataRaw = fs.readFileSync("./package.json");
    const packageData = JSON.parse(packageDataRaw.toString());
    const operationIdFactory = (controllerKey: string, methodKey: string) =>
      `${methodKey}`;

    // NonAdmin Swagger Setup
    const nonAdminSwaggerOptions = new DocumentBuilder()
      .setTitle("Main Service API")
      .setDescription("Main Service API")
      .setVersion(packageData.version)
      .addBearerAuth({
        type: "apiKey",
        name: "authorization",
        in: "header",
      })
      .build();
    const nonAdminSwaggerDocument = SwaggerModule.createDocument(
      app,
      nonAdminSwaggerOptions,
      {
        operationIdFactory,
        include: [
          TagModule,
          HealthModule
        ],
      }
    );
    SwaggerModule.setup("main/docs", app, nonAdminSwaggerDocument);

    // Admin Swagger Setup
    const adminSwaggerOptions = new DocumentBuilder()
      .setTitle("Main Service Admin API")
      .setDescription("Main Service Admin API")
      .setVersion(packageData.version)
      .addBearerAuth({
        type: "apiKey",
        name: "authorization",
        in: "header",
      })
      .build();
  }

  // start server
  await app.listen(process.env.PORT || 3000, "0.0.0.0", (err, address) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.info(`server listening on ${address}`);
  });
}
bootstrap();
