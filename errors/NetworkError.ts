import { UserFacingError } from "./UserFacingError";

export class NetworkError extends UserFacingError {
    constructor(originalError?: unknown) {
        super(
            "Connection Error",
            "We couldn't reach our servers. Please check your internet connection and try again.",
            originalError
        );
        Object.setPrototypeOf(this, NetworkError.prototype);
    }
}
