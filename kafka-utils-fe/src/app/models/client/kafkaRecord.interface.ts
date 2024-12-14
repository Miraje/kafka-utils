export interface KafkaRecord {
  topicName: string;
  partition: number;
  offset: number;
  headers?: Map<string, string>;
  timestamp: string;
  timestampUnixMs: bigint;
  key?: string;
  value: string;
}
/*
export interface KafkaRecord extends Omit<KafkaRecordData, 'timestamp'> {
  timestamp: Date;
}

export function kafkaRecordDataExtract(record: KafkaRecordData): KafkaRecord {
  return {
    ...record,
    timestamp: new Date(record.timestamp),
  };
}*/
