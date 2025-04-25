import { type } from "node:os";
import z,{TypeOf} from "zod";
export const registerUserSchema = z.object({
   body: z.object({
        email: z.string({
            required_error: "Email is required"
        }).email("Not a vaild email"),
        name: z.object({
            firstname: z.string({
                required_error: "First name is required"
            }).min(3, "First name must be at least 3 characters"),
            lastname: z.string({}).min(3, "First name must be at least 3 characters").optional()
        }),
        password : z.string({}).min(6, "Password must be atleast 6 characters long")
   })
})
export type RegisterUserType = TypeOf<typeof registerUserSchema>