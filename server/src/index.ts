import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createNursesInputSchema,
  generateScheduleInputSchema,
} from './schema';

// Import handlers
import { createNurses } from './handlers/create_nurses';
import { getNurses } from './handlers/get_nurses';
import { generateSchedule } from './handlers/generate_schedule';
import { getSchedule } from './handlers/get_schedule';
import { getAllSchedules } from './handlers/get_all_schedules';
import { deleteSchedule } from './handlers/delete_schedule';
import { exportSchedulePdf } from './handlers/export_schedule_pdf';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Nurse management
  createNurses: publicProcedure
    .input(createNursesInputSchema)
    .mutation(({ input }) => createNurses(input)),

  getNurses: publicProcedure
    .query(() => getNurses()),

  // Schedule management
  generateSchedule: publicProcedure
    .input(generateScheduleInputSchema)
    .mutation(({ input }) => generateSchedule(input)),

  getSchedule: publicProcedure
    .input(z.object({ scheduleId: z.number() }))
    .query(({ input }) => getSchedule(input.scheduleId)),

  getAllSchedules: publicProcedure
    .query(() => getAllSchedules()),

  deleteSchedule: publicProcedure
    .input(z.object({ scheduleId: z.number() }))
    .mutation(({ input }) => deleteSchedule(input.scheduleId)),

  // PDF export
  exportSchedulePdf: publicProcedure
    .input(z.object({ scheduleId: z.number() }))
    .query(({ input }) => exportSchedulePdf(input.scheduleId)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();