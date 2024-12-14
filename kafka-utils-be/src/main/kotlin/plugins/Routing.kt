package pt.miraje.plugins

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.post
import io.ktor.server.routing.routing
import pt.miraje.controllers.consumerController
import pt.miraje.dto.RequestConsumer
import pt.miraje.dto.toSuccessResponse
import pt.miraje.services.KafkaConsumerService


fun Application.configureRouting() {
    routing {
        consumerController()
    }
}