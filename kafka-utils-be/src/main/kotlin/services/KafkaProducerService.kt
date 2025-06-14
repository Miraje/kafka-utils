package pt.miraje.services

import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerRecord
import org.apache.kafka.clients.producer.RecordMetadata
import pt.miraje.logger
import java.util.Properties

class KafkaProducerService(private val configurations: Properties) {
    private val producer: KafkaProducer<String, String> = KafkaProducer<String, String>(configurations)

    fun produce(
        topicName: String = configurations.getProperty("input.topic.name"),
        key: String? = configurations.getProperty("input.message.key"),
        value: String? = configurations.getProperty("input.message.value")
    ): RecordMetadata {
        logger.info { "Topic name: [$topicName], key: [$key]" }
        logger.debug { "Value: [$value]" }

        return producer.use { client ->
            client.send(ProducerRecord(topicName, key, value)) { metadata, exception ->
                if (exception != null) {
                    logger.error(exception) { "Error while producing message to [$topicName]: ${exception.message}" }
                    throw exception
                }
                logger.info { "Record sent to [$topicName] on partition [${metadata.partition()}] at offset [${metadata.offset()}]" }
            }.get()
        }
    }
}