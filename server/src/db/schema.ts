import { serial, text, pgTable, timestamp, integer, date, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Shift type enum
export const shiftTypeEnum = pgEnum('shift_type', ['Morning', 'Afternoon', 'Night', 'Day Off']);

// Nurses table
export const nursesTable = pgTable('nurses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Monthly schedules table
export const monthlySchedulesTable = pgTable('monthly_schedules', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  month: integer('month').notNull(), // 1-12
  year: integer('year').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Schedule entries table - individual shift assignments
export const scheduleEntriesTable = pgTable('schedule_entries', {
  id: serial('id').primaryKey(),
  nurse_id: integer('nurse_id').notNull().references(() => nursesTable.id, { onDelete: 'cascade' }),
  schedule_id: integer('schedule_id').notNull().references(() => monthlySchedulesTable.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  shift_type: shiftTypeEnum('shift_type').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const nursesRelations = relations(nursesTable, ({ many }) => ({
  scheduleEntries: many(scheduleEntriesTable),
}));

export const monthlySchedulesRelations = relations(monthlySchedulesTable, ({ many }) => ({
  scheduleEntries: many(scheduleEntriesTable),
}));

export const scheduleEntriesRelations = relations(scheduleEntriesTable, ({ one }) => ({
  nurse: one(nursesTable, {
    fields: [scheduleEntriesTable.nurse_id],
    references: [nursesTable.id],
  }),
  schedule: one(monthlySchedulesTable, {
    fields: [scheduleEntriesTable.schedule_id],
    references: [monthlySchedulesTable.id],
  }),
}));

// TypeScript types for the table schemas
export type Nurse = typeof nursesTable.$inferSelect;
export type NewNurse = typeof nursesTable.$inferInsert;

export type MonthlySchedule = typeof monthlySchedulesTable.$inferSelect;
export type NewMonthlySchedule = typeof monthlySchedulesTable.$inferInsert;

export type ScheduleEntry = typeof scheduleEntriesTable.$inferSelect;
export type NewScheduleEntry = typeof scheduleEntriesTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  nurses: nursesTable,
  monthlySchedules: monthlySchedulesTable,
  scheduleEntries: scheduleEntriesTable,
};