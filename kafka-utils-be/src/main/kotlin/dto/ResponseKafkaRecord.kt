package pt.miraje.dto

import org.apache.kafka.clients.consumer.ConsumerRecord
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId


data class ResponseKafkaRecord(
    val topicName: String,
    val partition: Int,
    val offset: Long,
    val headers: Map<String, String>?,
    val timestamp: LocalDateTime,
    val timestampUnixMs: Long,
    val key: String?,
    val value: String,
)

fun ConsumerRecord<String, String>.toKafkaRecord() = ResponseKafkaRecord(
    topicName = this.topic(),
    partition = this.partition(),
    offset = this.offset(),
    headers = this.headers()?.let { headers -> headers.associate { it.key() to it.value().decodeToString() } },
    timestamp = epochTimeMillisToLocalDateTime(this.timestamp()),
    timestampUnixMs = this.timestamp(),
    key = this.key(),
    value = this.value()
)

private fun epochTimeMillisToLocalDateTime(epochTimeMillis: Long): LocalDateTime {
    val instant = Instant.ofEpochMilli(epochTimeMillis)
    val zoneId = ZoneId.systemDefault()
    return instant.atZone(zoneId).toLocalDateTime()
}