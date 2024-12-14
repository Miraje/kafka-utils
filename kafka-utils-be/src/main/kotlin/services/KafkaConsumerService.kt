package pt.miraje.services

import org.apache.kafka.clients.consumer.Consumer
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.apache.kafka.clients.consumer.ConsumerRecords
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.apache.kafka.common.TopicPartition
import pt.miraje.dto.ResponseKafkaRecord
import pt.miraje.dto.toKafkaRecord
import pt.miraje.logger
import java.time.Duration
import java.util.Properties

class KafkaConsumerService(private val configurations: Properties) {
    private val consumer: Consumer<String, String> = KafkaConsumer(configurations)
    private var shutdown = false

    init {
        Runtime.getRuntime().addShutdownHook(Thread { shutdown = true })
    }

    fun consumeFromBeginning(): MutableList<ResponseKafkaRecord> {
        val topicName = configurations.getProperty("input.topic.name")
        val topicPartitions = consumer.partitionsFor(topicName).map { TopicPartition(it.topic(), it.partition()) }

        logger.info { "Topic name: $topicName" }
        logger.info { "Topic partitions: $topicPartitions" }

        consumer.assign(topicPartitions)
        consumer.seekToBeginning(consumer.assignment())

        val endOffsets = consumer.endOffsets(consumer.assignment())

        logger.info { "Partitions end offsets: $endOffsets" }

        val response = mutableListOf<ResponseKafkaRecord>()

        do {
            val records = consumer.poll(Duration.ofMillis(1000))
            response.addAll(processRecords(records))
        } while (consumer.isTherePendingMessages(endOffsets) || shutdown)

        logger.info { "Finished consuming messages" }

        return response
    }

    private fun processRecords( records: ConsumerRecords<String, String> ): List<ResponseKafkaRecord> {
        val recordsList = mutableListOf<ResponseKafkaRecord>()

        records.forEach { record: ConsumerRecord<String, String> ->
            recordsList.add(record.toKafkaRecord().also { logger.info { "Message received: $it" } })
        }

        return recordsList
    }

    private inline fun <reified K : Any?, reified V : Any> Consumer<K, V>.isTherePendingMessages(endOffsets: MutableMap<TopicPartition, Long>) =
        endOffsets.any { this.position(it.key) < it.value }
}