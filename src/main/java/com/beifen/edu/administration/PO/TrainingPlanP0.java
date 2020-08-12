package com.beifen.edu.administration.PO;

import com.beifen.edu.administration.domian.Edu107;
import com.beifen.edu.administration.domian.Edu108;

public class TrainingPlanP0 {
    private Edu108 edu108;//培养计划-->课程 -->行政班 关系表
    private Edu107 edu107;//层次关系维护表

    public Edu108 getEdu108() {
        return edu108;
    }

    public void setEdu108(Edu108 edu108) {
        this.edu108 = edu108;
    }

    public Edu107 getEdu107() {
        return edu107;
    }

    public void setEdu107(Edu107 edu107) {
        this.edu107 = edu107;
    }
}
