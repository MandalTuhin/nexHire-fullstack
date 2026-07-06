package com.nexhire.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hiring_budgets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HiringBudget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false, unique = true)
    private Location location;

    @Column(nullable = false)
    private Integer totalSlots;

    @Column(nullable = false)
    @Builder.Default
    private Integer usedSlots = 0;
}
