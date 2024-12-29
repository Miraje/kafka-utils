package pt.miraje.controllers

import com.fasterxml.jackson.module.kotlin.readValue
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Routing
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import pt.miraje.dto.RequestConsumer
import pt.miraje.dto.ResponseKafkaRecord
import pt.miraje.dto.toSuccessResponse
import pt.miraje.services.KafkaConsumerService
import pt.miraje.utils.JsonMapper


fun Routing.consumerController() {
    route("/consume") {
        post {
            val requestConsumer = call.receive<RequestConsumer>()

            val kafkaConsumer = KafkaConsumerService(requestConsumer.configuration.toProperties())
            val response = kafkaConsumer.consumeFromBeginning()

            call.respond(status = HttpStatusCode.OK, message = response.toSuccessResponse())
        }
    }

    route("/mock") {
        post("/consume") {
            val fileStream = this.javaClass.getResourceAsStream("/mocks/responseKafkaRecord.json")
            val mockResponseKafkaRecord = JsonMapper.defaultMapper.readValue<List<ResponseKafkaRecord>>(fileStream!!)

            call.respond(status = HttpStatusCode.OK, message = mockResponseKafkaRecord.toSuccessResponse())
        }
    }
}