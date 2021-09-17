package com.beifen.edu.administration.PO;

public class StudentPO2 {
    private String title;
    private String valign;
    private String align;
    private Integer colspan;
    private Integer rowspan;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getValign() {
        return valign;
    }

    public void setValign(String valign) {
        this.valign = valign;
    }

    public String getAlign() {
        return align;
    }

    public void setAlign(String align) {
        this.align = align;
    }

    public Integer getColspan() {
        return colspan;
    }

    public void setColspan(Integer colspan) {
        this.colspan = colspan;
    }

    public Integer getRowspan() {
        return rowspan;
    }

    public void setRowspan(Integer rowspan) {
        this.rowspan = rowspan;
    }

    public StudentPO2(String title, String valign, String align, Integer colspan, Integer rowspan) {
        this.title = title;
        this.valign = valign;
        this.align = align;
        this.colspan = colspan;
        this.rowspan = rowspan;
    }

    public StudentPO2() {
    }
}
