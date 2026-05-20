package com.agrogreen.crops.service;

import com.agrogreen.crops.dto.CropRequest;
import com.agrogreen.crops.dto.CropResponse;
import com.agrogreen.crops.entity.Crop;
import com.agrogreen.crops.repository.CropRepository;
import com.agrogreen.zones.entity.Zone;
import com.agrogreen.zones.repository.ZoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Crops
 * Description: Service layer for crop business logic.
 */
@Service
@Transactional(readOnly = true)
public class CropService {

    private final CropRepository cropRepository;
    private final ZoneRepository zoneRepository;

    public CropService(CropRepository cropRepository, ZoneRepository zoneRepository) {
        this.cropRepository = cropRepository;
        this.zoneRepository = zoneRepository;
    }

    public List<CropResponse> findAll() {
        return cropRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CropResponse findById(Long id) {
        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cultivo no encontrado con id: " + id));

        return toResponse(crop);
    }

    public List<CropResponse> findByZoneId(Long zoneId) {
        return cropRepository.findByZoneId(zoneId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CropResponse create(CropRequest request) {
        Zone zone = zoneRepository.findById(request.getZoneId())
                .orElseThrow(() -> new RuntimeException("Zona no encontrada con id: " + request.getZoneId()));

        Crop crop = new Crop();
        crop.setZone(zone);
        crop.setName(request.getName());
        crop.setScientificName(request.getScientificName());
        crop.setPlantingDate(request.getPlantingDate());
        crop.setEstimatedHarvestDate(request.getEstimatedHarvestDate());
        crop.setStatus("GROWING");

        Crop savedCrop = cropRepository.save(crop);

        return toResponse(savedCrop);
    }

    @Transactional
    public CropResponse update(Long id, CropRequest request) {
        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cultivo no encontrado con id: " + id));

        Zone zone = zoneRepository.findById(request.getZoneId())
                .orElseThrow(() -> new RuntimeException("Zona no encontrada con id: " + request.getZoneId()));

        crop.setZone(zone);
        crop.setName(request.getName());
        crop.setScientificName(request.getScientificName());
        crop.setPlantingDate(request.getPlantingDate());
        crop.setEstimatedHarvestDate(request.getEstimatedHarvestDate());

        Crop updatedCrop = cropRepository.save(crop);

        return toResponse(updatedCrop);
    }

    @Transactional
    public void delete(Long id) {
        if (!cropRepository.existsById(id)) {
            throw new RuntimeException("Cultivo no encontrado con id: " + id);
        }

        cropRepository.deleteById(id);
    }

    private CropResponse toResponse(Crop crop) {
        return new CropResponse(
                crop.getId(),
                crop.getZone().getId(),
                crop.getZone().getName(),
                crop.getName(),
                crop.getScientificName(),
                crop.getPlantingDate(),
                crop.getEstimatedHarvestDate(),
                crop.getStatus(),
                crop.getCreatedAt(),
                crop.getUpdatedAt()
        );
    }
}