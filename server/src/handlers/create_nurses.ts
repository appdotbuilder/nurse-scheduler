import { type CreateNursesInput, type Nurse } from '../schema';

export async function createNurses(input: CreateNursesInput): Promise<Nurse[]> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is creating multiple nurses from a list of names
    // and persisting them in the database. This will be used when users input
    // a list of nurse names for scheduling.
    
    return input.names.map((name, index) => ({
        id: index + 1, // Placeholder ID
        name: name,
        created_at: new Date() // Placeholder date
    } as Nurse));
}