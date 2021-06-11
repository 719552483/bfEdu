package com.beifen.edu.administration.PO;

import com.beifen.edu.administration.domian.Edu403;

import java.util.List;

public class Edu403PO {
    private String xn;//学年
    private String xnid;//学年id
    private List<Edu403> pkjsxz;//Edu403List

    public String getXn() {
        return xn;
    }

    public void setXn(String xn) {
        this.xn = xn;
    }

    public String getXnid() {
        return xnid;
    }

    public void setXnid(String xnid) {
        this.xnid = xnid;
    }

    public List<Edu403> getPkjsxz() {
        return pkjsxz;
    }

    public void setPkjsxz(List<Edu403> pkjsxz) {
        this.pkjsxz = pkjsxz;
    }
}
