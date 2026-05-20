package com.agrogreen.zones.repository;

import com.agrogreen.zones.entity.Zone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Zones
 * Description: Repository for zone database operations.
 */
public interface ZoneRepository extends JpaRepository<Zone, Long> {

    List<Zone> findByGreenhouseId(Long greenhouseId);
}
