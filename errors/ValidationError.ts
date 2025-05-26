import { UserFacingError } from "./UserFacingError";

export class ValidationError extends UserFacingError {
    public fieldErrors: Record<string, string>;

    constructor(fieldErrors: Record<string, string>, originalError?: unknown) {
        super(
            "Validation Error",
            "Some fields require your attention.",
            originalError
        );
        this.fieldErrors = fieldErrors;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}