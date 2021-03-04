package com.beifen.edu.administration.PO;

import com.beifen.edu.administration.domian.Edu802;
import com.beifen.edu.administration.domian.Edu803;

import java.util.List;

public class Edu802PO extends Edu802 {
    private List<Edu803> edu803List;

    public List<Edu803> getEdu803List() {
        return edu803List;
    }

    public void setEdu803List(List<Edu803> edu803List) {
        this.edu803List = edu803List;
    }
}
