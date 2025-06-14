package pt.miraje.dto

import org.apache.kafka.clients.producer.RecordMetadata
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId

data class ResponseMetadata(
    val partition: Int,
    val offset: Long,
    val timestamp: LocalDateTime
)

fun RecordMetadata.toResponseMetadata() = ResponseMetadata(
    partition = this.partition(),
    offset = this.offset(),
    timestamp = epochTimeMillisToLocalDateTime(this.timestamp()),
)

private fun epochTimeMillisToLocalDateTime(epochTimeMillis: Long): LocalDateTime {
    val instant = Instant.ofEpochMilli(epochTimeMillis)
    val zoneId = ZoneId.systemDefault()
    return instant.atZone(zoneId).toLocalDateTime()
}