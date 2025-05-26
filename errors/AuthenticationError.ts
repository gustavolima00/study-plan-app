import { UserFacingError } from "./UserFacingError";

export class AuthenticationError extends UserFacingError {
    constructor(description?: string, originalError?: unknown) {
        super(
            "Authentication Failed",
            description || "Your session has expired or you don't have permission to access this resource.",
            originalError
        );
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}