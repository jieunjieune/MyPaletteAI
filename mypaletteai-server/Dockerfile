# 1️⃣ Java 17 사용
FROM eclipse-temurin:17

# 2️⃣ 작업 디렉토리
WORKDIR /app

# 3️⃣ Gradle Wrapper + 프로젝트 복사
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle .
COPY settings.gradle .
COPY src/ src/

# 4️⃣ 실행 권한
RUN chmod +x ./gradlew

# 5️⃣ Gradle 빌드 (의존성 다운 + 테스트 제외)
RUN ./gradlew build -x test --stacktrace --no-daemon

# 6️⃣ jar 실행
CMD ["sh", "-c", "java -jar build/libs/*.jar"]