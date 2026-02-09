import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
// Note: We import from the source during development, 
// but Vercel handles the TS compilation
import { AppModule } from '../src/app.module';

const server = express();

export const createServer = async () => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.init();
  return server;
};

export default async (req: any, res: any) => {
  await createServer();
  server(req, res);
};
