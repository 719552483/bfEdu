package com.beifen.edu.administration.PO;

import com.beifen.edu.administration.domian.Edu801;
import com.beifen.edu.administration.domian.Edu802;
import com.beifen.edu.administration.domian.Edu803;

import java.util.List;

public class Edu801PO extends Edu801 {
    private List<Edu802PO> edu802List;

    public List<Edu802PO> getEdu802List() {
        return edu802List;
    }

    public void setEdu802List(List<Edu802PO> edu802List) {
        this.edu802List = edu802List;
    }
}
