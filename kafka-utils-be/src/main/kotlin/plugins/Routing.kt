package pt.miraje.plugins

import io.ktor.server.application.Application
import io.ktor.server.routing.routing
import pt.miraje.controllers.consumerController
import pt.miraje.controllers.producerController


fun Application.configureRouting() {
    routing {
        consumerController()
        producerController()
    }
}