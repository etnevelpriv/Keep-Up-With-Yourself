import { expect, test, describe, vi } from 'vitest'
import createTestUser from '../../modelsTests/userTestSetup'
import { createUserDocumentInDatabase, getUserDocumentFromDatabase } from '../../../services/user/user.service'
vi.mock("../../../utils/popup.ts", ()=>({
    showErrorPopUp:vi.fn(),
    showInfoPopUp:vi.fn()
}))
describe("User Service Integration teszt", () =>{
    test("User dokumentum lerehozasa es lekerese", async () =>{
        const user = createTestUser();
        const uid = "TEST_USER_ID"
        await createUserDocumentInDatabase(uid, user.email, user.name, user.createdAt, user.verified);
        const dbUser = await getUserDocumentFromDatabase(uid);
        expect(dbUser).not.toBe(false);
    });
});