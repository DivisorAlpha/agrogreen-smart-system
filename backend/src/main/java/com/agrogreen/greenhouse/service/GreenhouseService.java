package com.agrogreen.greenhouse.service;

import com.agrogreen.greenhouse.dto.GreenhouseRequest;
import com.agrogreen.greenhouse.dto.GreenhouseResponse;
import com.agrogreen.greenhouse.entity.Greenhouse;
import com.agrogreen.greenhouse.repository.GreenhouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Project: AgroGreen Smart System
 * Module: Greenhouse
 * Description: Service layer for greenhouse business logic.
 */
@Service
public class GreenhouseService {

    private final GreenhouseRepository greenhouseRepository;

    public GreenhouseService(GreenhouseRepository greenhouseRepository) {
        this.greenhouseRepository = greenhouseRepository;
    }

    public List<GreenhouseResponse> findAll() {
        return greenhouseRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public GreenhouseResponse findById(Long id) {
        Greenhouse greenhouse = greenhouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invernadero no encontrado con id: " + id));

        return toResponse(greenhouse);
    }

    public GreenhouseResponse create(GreenhouseRequest request) {
        Greenhouse greenhouse = new Greenhouse();
        greenhouse.setName(request.getName());
        greenhouse.setLocation(request.getLocation());
        greenhouse.setDescription(request.getDescription());
        greenhouse.setStatus("ACTIVE");

        Greenhouse savedGreenhouse = greenhouseRepository.save(greenhouse);

        return toResponse(savedGreenhouse);
    }

    public GreenhouseResponse update(Long id, GreenhouseRequest request) {
        Greenhouse greenhouse = greenhouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invernadero no encontrado con id: " + id));

        greenhouse.setName(request.getName());
        greenhouse.setLocation(request.getLocation());
        greenhouse.setDescription(request.getDescription());

        Greenhouse updatedGreenhouse = greenhouseRepository.save(greenhouse);

        return toResponse(updatedGreenhouse);
    }

    public void delete(Long id) {
        if (!greenhouseRepository.existsById(id)) {
            throw new RuntimeException("Invernadero no encontrado con id: " + id);
        }

        greenhouseRepository.deleteById(id);
    }

    private GreenhouseResponse toResponse(Greenhouse greenhouse) {
        return new GreenhouseResponse(
                greenhouse.getId(),
                greenhouse.getName(),
                greenhouse.getLocation(),
                greenhouse.getDescription(),
                greenhouse.getStatus(),
                greenhouse.getCreatedAt(),
                greenhouse.getUpdatedAt()
        );
    }
}