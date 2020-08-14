package com.beifen.edu.administration.PO;

import com.beifen.edu.administration.domian.Edu101;

import java.util.List;

public class TeacherPO extends Edu101 {
    private List<String> ls;
    private List<String> lsmc;
    private List<String> zyls;
    private List<String> zylsmc;

    public List<String> getLs() {
        return ls;
    }

    public void setLs(List<String> ls) {
        this.ls = ls;
    }

    public List<String> getLsmc() {
        return lsmc;
    }

    public void setLsmc(List<String> lsmc) {
        this.lsmc = lsmc;
    }

    public List<String> getZyls() {
        return zyls;
    }

    public void setZyls(List<String> zyls) {
        this.zyls = zyls;
    }

    public List<String> getZylsmc() {
        return zylsmc;
    }

    public void setZylsmc(List<String> zylsmc) {
        this.zylsmc = zylsmc;
    }
}
