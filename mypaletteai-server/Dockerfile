# 1️⃣ Java 17 사용 (경량 Alpine 이미지)
FROM openjdk:17-jdk-alpine

# 2️⃣ 작업 디렉토리 설정
WORKDIR /app

# 3️⃣ Gradle Wrapper + 프로젝트 복사
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle .
COPY settings.gradle .
COPY src/ src/

# 4️⃣ 실행 권한
RUN chmod +x ./gradlew

# 5️⃣ Gradle 빌드
RUN ./gradlew build -x test

# 6️⃣ jar 자동 찾기
CMD ["sh", "-c", "java -jar build/libs/*.jar"]