package pt.miraje.plugins

import io.ktor.server.application.Application
import io.ktor.server.application.ApplicationCallPipeline
import kotlinx.coroutines.slf4j.MDCContext
import kotlinx.coroutines.withContext
import org.slf4j.MDC
import pt.miraje.utils.TRANSACTION_ID
import java.util.UUID

fun Application.configureMDC() {
    intercept(ApplicationCallPipeline.Plugins) {
        val uuid = UUID.randomUUID().toString()
        MDC.put(TRANSACTION_ID, uuid)
        try {
            withContext(MDCContext()) {
                proceed()
            }
        } finally {
            MDC.remove(TRANSACTION_ID)
        }
    }
}