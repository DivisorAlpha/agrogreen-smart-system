package com.agrogreen.crops.repository;

import com.agrogreen.crops.entity.Crop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Crops
 * Description: Repository for crop database operations.
 */
public interface CropRepository extends JpaRepository<Crop, Long> {

    List<Crop> findByZoneId(Long zoneId);
}