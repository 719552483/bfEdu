package com.beifen.edu.administration.PO;


public class Edu991PO {
    private String BF991_ID;
    private String js;  //角色类型(名称)
    private String cdqx;  //菜单权限(指定长度700)
    private String anqx;//按钮权限

    public String getBF991_ID() {
        return BF991_ID;
    }

    public void setBF991_ID(String BF991_ID) {
        this.BF991_ID = BF991_ID;
    }

    public String getJs() {
        return js;
    }

    public void setJs(String js) {
        this.js = js;
    }

    public String getCdqx() {
        return cdqx;
    }

    public void setCdqx(String cdqx) {
        this.cdqx = cdqx;
    }

    public String getAnqx() {
        return anqx;
    }

    public void setAnqx(String anqx) {
        this.anqx = anqx;
    }
}
