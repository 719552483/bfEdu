package com.beifen.edu.administration.PO;

public class StudentPO {
    private String field;
    private String title;
    private String valign;
    private String align;
    private Integer colspan;
    private Integer rowspan;
    private String formatter;

    public String getFormatter() {
        return formatter;
    }

    public void setFormatter(String formatter) {
        this.formatter = formatter;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

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

    public StudentPO(String field, String title, String valign, String align, Integer colspan, Integer rowspan, String formatter) {
        this.field = field;
        this.title = title;
        this.valign = valign;
        this.align = align;
        this.colspan = colspan;
        this.rowspan = rowspan;
        this.formatter = formatter;
    }

    public StudentPO() {
    }
}
