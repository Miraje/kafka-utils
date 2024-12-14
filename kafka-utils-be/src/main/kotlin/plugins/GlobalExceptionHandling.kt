package pt.miraje.plugins

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.request.httpMethod
import io.ktor.server.request.uri
import io.ktor.server.response.respond
import pt.miraje.dto.toErrorResponse
import pt.miraje.logger

fun Application.configureGlobalExceptionHandling() {
    install(StatusPages) {
        exception<Exception> { call, exception ->
            logger.error(exception) { "Fail on received request ${call.request.httpMethod} to URI:[${call.request.uri}] - $exception.message" }
            call.respond(HttpStatusCode.InternalServerError, exception.toErrorResponse())
        }
    }
}