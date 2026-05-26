import type { UserInterface } from "../../interfaces/UserInterface.ts";
import { User } from "../../models/User.ts";

export function createTestUser(overrides?: Partial<UserInterface>): User {
    const defaults: UserInterface = {
        name: "TESZT USER NAME",
        password: "Password123!",
        email: "tesztuseremail@gmail.com",
        createdAt: new Date(2025, 5, 5),
        verified: true,
    };

    const data: UserInterface = { ...defaults, ...(overrides || {}) } as UserInterface;

    return new User(
        data.name,
        data.password,
        data.email,
        data.createdAt,
        data.verified
    );
}

export default createTestUser;
