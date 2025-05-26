export class UserFacingError extends Error {
    public title: string;
    public description: string;
    public isUserFacing: boolean = true;
    public originalError?: unknown;

    constructor(title: string, description: string, originalError?: unknown) {
        super(description);
        this.title = title;
        this.description = description;
        this.originalError = originalError;

        // Maintain proper prototype chain
        Object.setPrototypeOf(this, UserFacingError.prototype);
    }

    public toJSON() {
        return {
            title: this.title,
            description: this.description,
            stack: this.stack,
            originalError: this.originalError
        };
    }
}