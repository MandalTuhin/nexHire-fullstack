package com.nexhire.repository;

import com.nexhire.entity.Trainee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TraineeRepository extends JpaRepository<Trainee, Long> {

    Optional<Trainee> findByUserId(Long userId);

    Optional<Trainee> findByApplicationId(Long applicationId);
}
