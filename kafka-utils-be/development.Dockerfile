FROM gradle:jdk17-corretto

COPY --chown=gradle:gradle ./kafka-utils-be /home/app

WORKDIR /home/app

RUN gradle assemble -x test

CMD ["java", "-jar", "./build/libs/kafka-utils-all.jar"]