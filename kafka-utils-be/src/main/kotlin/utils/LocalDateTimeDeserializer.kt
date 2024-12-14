package pt.miraje.utils

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class LocalDateTimeDeserializer : JsonDeserializer<LocalDateTime>() {
    private val fmt = DateTimeFormatter.ISO_DATE_TIME

    override fun deserialize(p: JsonParser?, ctxt: DeserializationContext?): LocalDateTime {
        return LocalDateTime.parse(p?.valueAsString, fmt)
    }

}