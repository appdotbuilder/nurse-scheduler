import { z } from 'zod';

// Nurse schema
export const nurseSchema = z.object({
  id: z.number(),
  name: z.string(),
  created_at: z.coerce.date()
});

export type Nurse = z.infer<typeof nurseSchema>;

// Shift type enum
export const shiftTypeSchema = z.enum(['Morning', 'Afternoon', 'Night', 'Day Off']);
export type ShiftType = z.infer<typeof shiftTypeSchema>;

// Schedule entry schema
export const scheduleEntrySchema = z.object({
  id: z.number(),
  nurse_id: z.number(),
  schedule_id: z.number(),
  date: z.coerce.date(),
  shift_type: shiftTypeSchema,
  created_at: z.coerce.date()
});

export type ScheduleEntry = z.infer<typeof scheduleEntrySchema>;

// Monthly schedule schema
export const monthlyScheduleSchema = z.object({
  id: z.number(),
  title: z.string(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(3000),
  created_at: z.coerce.date()
});

export type MonthlySchedule = z.infer<typeof monthlyScheduleSchema>;

// Input schema for creating nurses
export const createNurseInputSchema = z.object({
  name: z.string().min(1, "Nurse name is required")
});

export type CreateNurseInput = z.infer<typeof createNurseInputSchema>;

// Input schema for creating multiple nurses
export const createNursesInputSchema = z.object({
  names: z.array(z.string().min(1, "Nurse name is required")).min(1, "At least one nurse is required")
});

export type CreateNursesInput = z.infer<typeof createNursesInputSchema>;

// Input schema for generating schedule
export const generateScheduleInputSchema = z.object({
  title: z.string().min(1, "Schedule title is required"),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(3000),
  nurse_ids: z.array(z.number()).min(4, "At least 4 nurses are required for scheduling")
});

export type GenerateScheduleInput = z.infer<typeof generateScheduleInputSchema>;

// Schedule response with detailed information
export const scheduleResponseSchema = z.object({
  schedule: monthlyScheduleSchema,
  entries: z.array(scheduleEntrySchema.extend({
    nurse_name: z.string()
  })),
  nurses: z.array(nurseSchema)
});

export type ScheduleResponse = z.infer<typeof scheduleResponseSchema>;

// Daily schedule view schema
export const dailyScheduleSchema = z.object({
  date: z.coerce.date(),
  morning: z.array(z.string()),
  afternoon: z.array(z.string()),
  night: z.array(z.string()),
  day_off: z.array(z.string())
});

export type DailySchedule = z.infer<typeof dailyScheduleSchema>;

// Monthly schedule view schema
export const monthlyScheduleViewSchema = z.object({
  id: z.number(),
  title: z.string(),
  month: z.number(),
  year: z.number(),
  daily_schedules: z.array(dailyScheduleSchema)
});

export type MonthlyScheduleView = z.infer<typeof monthlyScheduleViewSchema>;