package com.nexhire.seed;

import com.nexhire.entity.*;
import com.nexhire.enums.LifecycleStatus;
import com.nexhire.enums.UserRole;
import com.nexhire.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final JobRepository jobRepository;
    private final HiringBudgetRepository hiringBudgetRepository;
    private final TrainingSeatRepository trainingSeatRepository;
    private final ProjectRepository projectRepository;
    private final AssetRepository assetRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping.");
            return;
        }

        log.info("Seeding database with sample data...");

        // Seed users
        User admin = userRepository.save(User.builder()
                .name("Admin User")
                .email("admin@nexhire.com")
                .password(passwordEncoder.encode("admin123"))
                .phone("9000000001")
                .role(UserRole.ADMIN)
                .build());

        User hr = userRepository.save(User.builder()
                .name("HR Manager")
                .email("hr@nexhire.com")
                .password(passwordEncoder.encode("hr123"))
                .phone("9000000002")
                .role(UserRole.HR)
                .build());

        User rmg = userRepository.save(User.builder()
                .name("RMG Manager")
                .email("rmg@nexhire.com")
                .password(passwordEncoder.encode("rmg123"))
                .phone("9000000003")
                .role(UserRole.RMG)
                .build());

        User candidate1 = userRepository.save(User.builder()
                .name("John Candidate")
                .email("candidate1@nexhire.com")
                .password(passwordEncoder.encode("candidate123"))
                .phone("9000000004")
                .role(UserRole.EMPLOYEE)
                .lifecycleStatus(LifecycleStatus.CANDIDATE)
                .build());

        User candidate2 = userRepository.save(User.builder()
                .name("Jane Candidate")
                .email("candidate2@nexhire.com")
                .password(passwordEncoder.encode("candidate123"))
                .phone("9000000005")
                .role(UserRole.EMPLOYEE)
                .lifecycleStatus(LifecycleStatus.CANDIDATE)
                .build());

        // Seed locations
        Location bangalore = locationRepository.save(Location.builder()
                .name("Bangalore")
                .city("Bangalore")
                .build());

        Location hyderabad = locationRepository.save(Location.builder()
                .name("Hyderabad")
                .city("Hyderabad")
                .build());

        // Seed hiring budgets
        hiringBudgetRepository.save(HiringBudget.builder()
                .location(bangalore)
                .totalSlots(10)
                .usedSlots(0)
                .build());

        hiringBudgetRepository.save(HiringBudget.builder()
                .location(hyderabad)
                .totalSlots(8)
                .usedSlots(0)
                .build());

        // Seed training seats
        trainingSeatRepository.save(TrainingSeat.builder()
                .location(bangalore)
                .totalSeats(15)
                .occupiedSeats(0)
                .build());

        trainingSeatRepository.save(TrainingSeat.builder()
                .location(hyderabad)
                .totalSeats(10)
                .occupiedSeats(0)
                .build());

        // Seed jobs
        jobRepository.save(Job.builder()
                .title("Java Developer")
                .description("Develop and maintain Java-based applications using Spring Boot.")
                .requirements("Java 17, Spring Boot, REST APIs, PostgreSQL")
                .location(bangalore)
                .build());

        jobRepository.save(Job.builder()
                .title("Angular Developer")
                .description("Build modern web applications using Angular framework.")
                .requirements("Angular 17+, TypeScript, HTML/CSS, REST integration")
                .location(hyderabad)
                .build());

        jobRepository.save(Job.builder()
                .title("Full Stack Developer")
                .description("Work on both frontend and backend of enterprise applications.")
                .requirements("Java, Angular, PostgreSQL, Docker basics")
                .location(bangalore)
                .build());

        // Seed projects
        projectRepository.save(Project.builder()
                .name("Project Alpha")
                .description("Enterprise resource planning system")
                .build());

        projectRepository.save(Project.builder()
                .name("Project Beta")
                .description("Customer relationship management platform")
                .build());

        // Seed assets
        assetRepository.save(Asset.builder()
                .name("Dell Latitude 5540")
                .type("LAPTOP")
                .serialNumber("DL-5540-0001")
                .build());
        assetRepository.save(Asset.builder()
                .name("Dell Latitude 5540")
                .type("LAPTOP")
                .serialNumber("DL-5540-0002")
                .build());
        assetRepository.save(Asset.builder()
                .name("Employee ID Card")
                .type("ID_CARD")
                .serialNumber("IDC-0001")
                .build());
        assetRepository.save(Asset.builder()
                .name("Logitech Headset")
                .type("HEADSET")
                .serialNumber("LG-HS-0001")
                .build());

        log.info("Database seeding complete.");
    }
}
