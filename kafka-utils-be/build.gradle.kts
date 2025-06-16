val kotlin_version: String by project
val logback_version: String by project

plugins {
    kotlin("jvm") version "2.0.0"
    id("io.ktor.plugin") version "2.3.12"
}

group = "pt.miraje"
version = "1.1.0"

application {
    mainClass.set("pt.miraje.ApplicationKt")

    val isDevelopment: Boolean = project.ext.has("development")
    applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.apache.kafka:kafka-clients:3.8.0")

    implementation("io.ktor:ktor-server-jvm:$kotlin_version")
    implementation("io.ktor:ktor-server-netty-jvm:$kotlin_version")
    implementation("io.ktor:ktor-serialization-jackson-jvm:$kotlin_version")
    implementation("io.ktor:ktor-server-content-negotiation-jvm:$kotlin_version")
    implementation("io.ktor:ktor-server-call-logging-jvm:$kotlin_version")

    implementation("io.insert-koin:koin-core:3.5.6")

    implementation("ch.qos.logback:logback-classic:$logback_version")
    implementation("io.github.microutils:kotlin-logging-jvm:3.0.5")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-slf4j:1.8.1")

    testImplementation(kotlin("test"))
    testImplementation("io.ktor:ktor-server-test-host-jvm")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")
}

tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(17)
}