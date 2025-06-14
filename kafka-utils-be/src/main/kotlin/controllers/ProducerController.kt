package pt.miraje.controllers

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Routing
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import pt.miraje.dto.RequestProducer
import pt.miraje.dto.toResponseMetadata
import pt.miraje.dto.toSuccessResponse
import pt.miraje.services.KafkaProducerService


fun Routing.producerController() {
    route("/produce") {
        post {
            val requestProducer = call.receive<RequestProducer>()

            val kafkaProducer = KafkaProducerService(requestProducer.configuration.toProperties())
            val response = kafkaProducer.produce().toResponseMetadata()

            call.respond(status = HttpStatusCode.OK, message = response.toSuccessResponse())
        }
    }
}