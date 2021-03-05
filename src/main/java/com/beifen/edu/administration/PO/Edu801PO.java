package com.beifen.edu.administration.PO;

import com.beifen.edu.administration.domian.Edu801;

import java.util.List;

public class Edu801PO extends Edu801 {
    private List<Edu802PO> allQuestions;

    public Edu801PO() {
    }

    public List<Edu802PO> getAllQuestions() {
        return allQuestions;
    }

    public void setAllQuestions(List<Edu802PO> allQuestions) {
        this.allQuestions = allQuestions;
    }
}
