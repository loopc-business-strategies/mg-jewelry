import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { join } from "path";
import { mkdirSync } from "fs";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
  app.enableCors({
    origin: (process.env.CORS_ORIGINS || "http://localhost:3000").split(","),
    credentials: true,
  });
  app.setGlobalPrefix("api");

  const uploadDir =
    process.env.UPLOAD_DIR || join(process.cwd(), "uploads");
  mkdirSync(uploadDir, { recursive: true });
  app.useStaticAssets(uploadDir, { prefix: "/api/uploads" });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = Number(process.env.PORT || process.env.API_PORT || 4000);
  await app.listen(port, "0.0.0.0");
  // eslint-disable-next-line no-console
  console.log(`MG Jewelry API listening on http://0.0.0.0:${port}`);
}

bootstrap();
