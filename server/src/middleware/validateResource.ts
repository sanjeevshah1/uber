import { Request, Response, NextFunction } from "express"
import { AnyZodObject, ZodError } from "zod"

const validateResource = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) =>{
    try{
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }catch(error: unknown){
        if(error instanceof ZodError){
            const formattedError = error.issues.map((err) => {
                const cleanedPath = err.path[0] === "body" ? err.path.slice(1).join(".") : err.path.join(".");
                    return {
                        path: cleanedPath,
                        message: err.message
                    }
                })
                
            res.status(400).send({
                success: false,
                errors: formattedError
            });
            // });
        }else{
            res.status(400).send("Something went wrong");
        }
    }  
}
export default validateResource;