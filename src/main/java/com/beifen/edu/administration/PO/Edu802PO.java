package com.beifen.edu.administration.PO;

import com.beifen.edu.administration.domian.Edu802;
import com.beifen.edu.administration.domian.Edu803;

import java.util.List;

public class Edu802PO extends Edu802 {
    private List<Edu803> ckeckOrRaidoInfo;

    public Edu802PO(){

    }

    public List<Edu803> getCkeckOrRaidoInfo() {
        return ckeckOrRaidoInfo;
    }

    public void setCkeckOrRaidoInfo(List<Edu803> ckeckOrRaidoInfo) {
        this.ckeckOrRaidoInfo = ckeckOrRaidoInfo;
    }
}
