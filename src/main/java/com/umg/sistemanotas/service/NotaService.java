package com.umg.sistemanotas.service;

import com.umg.sistemanotas.model.Nota;
import com.umg.sistemanotas.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotaService {
    @Autowired
    private NotaRepository notaRepository;

    public List<Nota> getAllNotas() {
        return notaRepository.findAll();
    }

    public Nota saveNota(Nota nota) {
        nota.calcularPuntajeTotal();
        return notaRepository.save(nota);
    }

    // Implementar otros métodos según sea necesario
}
