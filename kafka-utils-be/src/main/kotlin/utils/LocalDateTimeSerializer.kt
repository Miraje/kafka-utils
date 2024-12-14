package pt.miraje.utils

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter


class LocalDateTimeSerializer : JsonSerializer<LocalDateTime?>() {
    private val format: DateTimeFormatter = DateTimeFormatter.ISO_DATE_TIME

    override fun serialize(value: LocalDateTime?, gen: JsonGenerator?, serializers: SerializerProvider?) {
        gen?.writeString(value?.format(format))
    }
}