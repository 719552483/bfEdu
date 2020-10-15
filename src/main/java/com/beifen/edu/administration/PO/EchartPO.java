package com.beifen.edu.administration.PO;

public class EchartPO {

    private String name;
    private String value;

    public EchartPO() {}

    public EchartPO(String name, Long value) {
        this.name = name;
        this.value = value.toString();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
