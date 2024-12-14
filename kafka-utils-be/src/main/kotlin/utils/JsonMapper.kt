package pt.miraje.utils

import com.fasterxml.jackson.annotation.JsonAutoDetect
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import java.time.LocalDateTime

object JsonMapper {
    val defaultMapper: ObjectMapper = jacksonObjectMapper()
        .ignoreUnknownProperties()
        .enablePrettyPrint()
        .registerCustomSerializers()
        .registerKotlinModule()
        .includeNonNullProperties()
        .includeNoEmptyProperties()
        .setIsGetterMethodsVisibility()

    private fun ObjectMapper.enablePrettyPrint() = enable(SerializationFeature.INDENT_OUTPUT)

    private fun ObjectMapper.registerCustomSerializers() = registerModule(
        SimpleModule()
            .addSerializer(LocalDateTime::class.java, LocalDateTimeSerializer())
            .addDeserializer(LocalDateTime::class.java, LocalDateTimeDeserializer())
    )

    private fun ObjectMapper.includeNonNullProperties() = setSerializationInclusion(JsonInclude.Include.NON_NULL)

    private fun ObjectMapper.includeNoEmptyProperties() = setSerializationInclusion(JsonInclude.Include.NON_EMPTY)

    private fun ObjectMapper.setIsGetterMethodsVisibility() = setVisibility(
        serializationConfig.defaultVisibilityChecker.withIsGetterVisibility(JsonAutoDetect.Visibility.ANY)
    )

    private fun ObjectMapper.ignoreUnknownProperties() =
        configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
}