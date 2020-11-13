package com.beifen.edu.administration.PO;

import java.io.Serializable;

public class EchartPO implements Serializable {

    private String name;
    private String value;

    public EchartPO() {}

    public EchartPO(String name, Long value) {
        this.name = name;
        this.value = value.toString();
    }

    public EchartPO(String name, String value) {
        this.name = name;
        this.value = value;
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
