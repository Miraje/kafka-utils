package pt.miraje

import io.ktor.http.ContentType
import io.ktor.serialization.jackson.JacksonConverter
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.plugins.callloging.CallLogging
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import mu.KotlinLogging
import org.slf4j.event.Level
import pt.miraje.plugins.configureCORS
import pt.miraje.plugins.configureGlobalExceptionHandling
import pt.miraje.plugins.configureMDC
import pt.miraje.plugins.configureRouting
import pt.miraje.utils.JsonMapper


val logger = KotlinLogging.logger { }

fun main(args: Array<String>) {
    embeddedServer(
        factory = Netty,
        port = 8083,
        module = {
            main()
        }
    ).start(wait = true)
}

fun Application.main() {
    install(CallLogging) { level = Level.INFO }
    install(ContentNegotiation) {
        register(ContentType.Application.Json, JacksonConverter(JsonMapper.defaultMapper))
    }

    configureMDC()
    configureRouting()
    configureCORS()
    configureGlobalExceptionHandling()
}