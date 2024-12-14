### STAGE 1: Build ###
FROM gradle:jdk17-corretto AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle assemble --no-daemon

### STAGE 1: Run ###
FROM amazoncorretto:17-alpine
EXPOSE 8083
RUN mkdir /app
COPY --from=build /home/gradle/src/build/libs/*.jar /app/kafka-utils.jar
ENTRYPOINT ["java", "-jar", "app/kafka-utils.jar"]