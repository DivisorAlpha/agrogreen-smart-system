package com.agrogreen.zones.service;

import com.agrogreen.greenhouse.entity.Greenhouse;
import com.agrogreen.greenhouse.repository.GreenhouseRepository;
import com.agrogreen.zones.dto.ZoneRequest;
import com.agrogreen.zones.dto.ZoneResponse;
import com.agrogreen.zones.entity.Zone;
import com.agrogreen.zones.repository.ZoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Zones
 * Description: Service layer for zone business logic.
 */
@Service
@Transactional(readOnly = true)
public class ZoneService {

    private final ZoneRepository zoneRepository;
    private final GreenhouseRepository greenhouseRepository;

    public ZoneService(ZoneRepository zoneRepository, GreenhouseRepository greenhouseRepository) {
        this.zoneRepository = zoneRepository;
        this.greenhouseRepository = greenhouseRepository;
    }

    public List<ZoneResponse> findAll() {
        return zoneRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ZoneResponse findById(Long id) {
        Zone zone = zoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zona no encontrada con id: " + id));

        return toResponse(zone);
    }

    public List<ZoneResponse> findByGreenhouseId(Long greenhouseId) {
        return zoneRepository.findByGreenhouseId(greenhouseId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ZoneResponse create(ZoneRequest request) {
        Greenhouse greenhouse = greenhouseRepository.findById(request.getGreenhouseId())
                .orElseThrow(() -> new RuntimeException("Invernadero no encontrado con id: " + request.getGreenhouseId()));

        Zone zone = new Zone();
        zone.setGreenhouse(greenhouse);
        zone.setName(request.getName());
        zone.setDescription(request.getDescription());
        zone.setStatus("ACTIVE");

        Zone savedZone = zoneRepository.save(zone);

        return toResponse(savedZone);
    }

    @Transactional
    public ZoneResponse update(Long id, ZoneRequest request) {
        Zone zone = zoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zona no encontrada con id: " + id));

        Greenhouse greenhouse = greenhouseRepository.findById(request.getGreenhouseId())
                .orElseThrow(() -> new RuntimeException("Invernadero no encontrado con id: " + request.getGreenhouseId()));

        zone.setGreenhouse(greenhouse);
        zone.setName(request.getName());
        zone.setDescription(request.getDescription());

        Zone updatedZone = zoneRepository.save(zone);

        return toResponse(updatedZone);
    }

    @Transactional
    public void delete(Long id) {
        if (!zoneRepository.existsById(id)) {
            throw new RuntimeException("Zona no encontrada con id: " + id);
        }

        zoneRepository.deleteById(id);
    }

    private ZoneResponse toResponse(Zone zone) {
        return new ZoneResponse(
                zone.getId(),
                zone.getGreenhouse().getId(),
                zone.getGreenhouse().getName(),
                zone.getName(),
                zone.getDescription(),
                zone.getStatus(),
                zone.getCreatedAt(),
                zone.getUpdatedAt()
        );
    }
}