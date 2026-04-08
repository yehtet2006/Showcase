import { db } from '.';
import { eq } from 'drizzle-orm';
import { users, type NewUser} from './schema';

// User queries
export const createUser = async (user: NewUser) => {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
};

export const getUserById = async (id: string) => {
    return await db.query.users.findFirst({ where: eq(users.id, id)}); 
};

export const updateUser = async (id: string, data:Partial<NewUser>) => {
    const existingUser = await getUserById(id);
    if (!existingUser) {
        throw new Error(`User with id ${id} not found`);
    }
    const updatedUser = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updatedUser[0];

}

// Upsert user: if the user exists, update it; otherwise, create a new one
export const upsertUser = async (user: NewUser) => {
    const existingUser = await getUserById(user.id);
    if (existingUser) {
        return updateUser(user.id, user);
    }
    return createUser(user);
};

