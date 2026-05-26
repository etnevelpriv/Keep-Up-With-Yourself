import type { UserInterface } from "../../../interfaces/UserInterface.ts";

export function createTestUser(overrides?: Partial<UserInterface>) {
    const defaults: UserInterface = {
        name: "TESZT USER NAME",
        password: "Password123!",
        email: "tesztuseremail@gmail.com",
        createdAt: new Date(2025, 5, 5),
        verified: true,
    };

    const data: UserInterface = { ...defaults, ...(overrides || {}) } as UserInterface;

    return data;
}

export default createTestUser;
