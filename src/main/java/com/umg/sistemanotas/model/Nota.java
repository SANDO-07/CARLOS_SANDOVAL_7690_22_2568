package com.umg.sistemanotas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "notas")
public class Nota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "estudiante_id", nullable = false)
    private Estudiante estudiante;

    @Min(0) @Max(35)
    private Double actividades = 0.0;

    @Min(0) @Max(15)
    private Double primerParcial = 0.0;

    @Min(0) @Max(15)
    private Double segundoParcial = 0.0;

    @Min(0) @Max(35)
    private Double examenFinal = 0.0;

    private Double puntajeTotal = 0.0;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Estudiante getEstudiante() {
        return estudiante;
    }

    public void setEstudiante(Estudiante estudiante) {
        this.estudiante = estudiante;
    }

    public Double getActividades() {
        return actividades;
    }

    public void setActividades(Double actividades) {
        this.actividades = actividades;
    }

    public Double getPrimerParcial() {
        return primerParcial;
    }

    public void setPrimerParcial(Double primerParcial) {
        this.primerParcial = primerParcial;
    }

    public Double getSegundoParcial() {
        return segundoParcial;
    }

    public void setSegundoParcial(Double segundoParcial) {
        this.segundoParcial = segundoParcial;
    }

    public Double getExamenFinal() {
        return examenFinal;
    }

    public void setExamenFinal(Double examenFinal) {
        this.examenFinal = examenFinal;
    }

    public Double getPuntajeTotal() {
        return puntajeTotal;
    }

    public void setPuntajeTotal(Double puntajeTotal) {
        this.puntajeTotal = puntajeTotal;
    }

    public void calcularPuntajeTotal() {
        this.puntajeTotal = this.actividades + this.primerParcial + this.segundoParcial + this.examenFinal;
    }
}
