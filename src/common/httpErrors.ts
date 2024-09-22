import createHttpError from "http-errors";
import HttpStatus from "./httpStatusCodes";
import ResponseMessage from "../constants/responseMessage";

const CreateHttpError = {
    BadRequestError(message?: string) {
        return createHttpError(
            HttpStatus.BAD_REQUEST,
            message ?? ResponseMessage.BAD_REQUEST
        );
    },

    ConflictError(message?: string) {
        return createHttpError(
            HttpStatus.CONFLICT,
            message ?? ResponseMessage.CONFLICT
        );
    },

    UnauthorizedError(message?: string) {
        return createHttpError(
            HttpStatus.UNAUTHORIZED,
            message ?? ResponseMessage.UNAUTHORIZED
        );
    },

    ForbiddenError(message?: string) {
        return createHttpError(
            HttpStatus.FORBIDDEN,
            message ?? ResponseMessage.FORBIDDEN
        );
    },

    NotFoundError(message?: string) {
        return createHttpError(
            HttpStatus.NOT_FOUND,
            message ?? ResponseMessage.NOT_FOUND
        );
    },

    InternalServerError(message?: string) {
        return createHttpError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            message ?? ResponseMessage.INTERNAL_ERROR
        );
    },

    DatabaseError(message?: string) {
        return createHttpError(
            HttpStatus.INTERNAL_SERVER_ERROR,
            message ?? "database error occured"
        );
    }
};

export default CreateHttpError;

