const ResponseMessage = {
    SUCCESS: "Operation completed successfully",
    CREATED: "Resource created successfully",
    UPDATED: "Resource updated successfully",
    DELETED: "Resource deleted successfully",
    BAD_REQUEST: "Invalid request parameters",
    UNAUTHORIZED: "Authentication required",
    FORBIDDEN: "Access denied",
    NOT_FOUND: "Resource not found",
    CONFLICT: "Resource already exists",
    INTERNAL_ERROR: "An unexpected error occurred",
    SERVICE_UNAVAILABLE: "Service temporarily unavailable",
    VALIDATION_ERROR: "Data validation failed",
    RATE_LIMITED: "Too many requests, please try again later",
    MAINTENANCE: "System under maintenance, please try again soon",
    TIMEOUT: "Operation timed out",
    PARTIAL_CONTENT: "Partial content returned"
};

export default ResponseMessage;

