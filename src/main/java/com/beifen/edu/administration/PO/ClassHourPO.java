package com.beifen.edu.administration.PO;

public class ClassHourPO {
    private Integer theoreticalClassHours;//理论学时
    private Integer PracticeClassHours;//实践学时
    private Integer scatteredClassHours;//分散学时
    private Integer concentratedClassHours;//集中学时

    public ClassHourPO(){}

    public ClassHourPO(Double theoreticalClassHours, Double practiceClass, Double scatteredClassHours, Double concentratedClassHours) {
        this.theoreticalClassHours =theoreticalClassHours.intValue();
        this.PracticeClassHours = practiceClass.intValue();
        this.scatteredClassHours = scatteredClassHours.intValue();
        this.concentratedClassHours = concentratedClassHours.intValue();
    }

    public Integer getTheoreticalClassHours() {
        return theoreticalClassHours;
    }

    public void setTheoreticalClassHours(Integer theoreticalClassHours) {
        this.theoreticalClassHours = theoreticalClassHours;
    }

    public Integer getPracticeClassHours() {
        return PracticeClassHours;
    }

    public void setPracticeClassHours(Integer practiceClassHours) {
        PracticeClassHours = practiceClassHours;
    }

    public Integer getScatteredClassHours() {
        return scatteredClassHours;
    }

    public void setScatteredClassHours(Integer scatteredClassHours) {
        this.scatteredClassHours = scatteredClassHours;
    }

    public Integer getConcentratedClassHours() {
        return concentratedClassHours;
    }

    public void setConcentratedClassHours(Integer concentratedClassHours) {
        this.concentratedClassHours = concentratedClassHours;
    }
}
