package com.umg.sistemanotas.controller;

import com.umg.sistemanotas.model.Nota;
import com.umg.sistemanotas.model.Estudiante;
import com.umg.sistemanotas.repository.NotaRepository;
import com.umg.sistemanotas.repository.EstudianteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notas")
public class NotaController {
    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @GetMapping
    public List<Nota> getAllNotas() {
        return notaRepository.findAll();
    }

    @GetMapping("/{id}")
    public Nota getNotaById(@PathVariable Long id) {
        return notaRepository.findById(id).orElseThrow(() -> new RuntimeException("Nota no encontrada"));
    }

    @PostMapping
    public Nota createNota(@RequestBody Nota nota) {
        Estudiante estudiante = estudianteRepository.findById(nota.getEstudiante().getId())
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        nota.setEstudiante(estudiante);
        nota.calcularPuntajeTotal();
        return notaRepository.save(nota);
    }

    @PutMapping("/{id}")
    public Nota updateNota(@PathVariable Long id, @RequestBody Nota notaActualizada) {
        Nota nota = notaRepository.findById(id).orElseThrow(() -> new RuntimeException("Nota no encontrada"));
        Estudiante estudiante = estudianteRepository.findById(notaActualizada.getEstudiante().getId())
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        nota.setEstudiante(estudiante);
        nota.setActividades(notaActualizada.getActividades());
        nota.setPrimerParcial(notaActualizada.getPrimerParcial());
        nota.setSegundoParcial(notaActualizada.getSegundoParcial());
        nota.setExamenFinal(notaActualizada.getExamenFinal());
        nota.calcularPuntajeTotal();
        return notaRepository.save(nota);
    }
}
