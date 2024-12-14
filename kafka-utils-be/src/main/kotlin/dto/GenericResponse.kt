package pt.miraje.dto

data class GenericResponse<T>(
    val data: T? = null,
    val errors: MutableList<GenericError>? = null
)

data class GenericError(
    val httpCode: Int?,
    val code: String,
    val message: String,
)

fun <T> T.toSuccessResponse(): GenericResponse<T> = GenericResponse<T>(data = this)

fun <T> T.toErrorResponse(): GenericResponse<T> = GenericResponse<T>(data = this, errors = mutableListOf())

fun <T : Exception> T.toErrorResponse(): GenericResponse<Nothing> =
    GenericResponse(data = null, errors = mutableListOf()).addError(code = "system.internal", message = "System error")

fun <T> GenericResponse<T>.addError(
    httpCode: Int? = null,
    code: String,
    message: String
): GenericResponse<T> {
    this.errors?.add(GenericError(httpCode = httpCode, code = code, message = message))
    return this
}