package com.beifen.edu.administration.PO;

import java.util.List;
import java.util.Map;

public class TimeTablePO {

    private String semester;//学年
    private String weekTime;//周数
    private String currentUserId;//用户id
    private List<Map> newInfo;//课程表展示集合

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public String getWeekTime() {
        return weekTime;
    }

    public void setWeekTime(String weekTime) {
        this.weekTime = weekTime;
    }

    public String getCurrentUserId() {
        return currentUserId;
    }

    public void setCurrentUserId(String currentUserId) {
        this.currentUserId = currentUserId;
    }

    public List<Map> getNewInfo() {
        return newInfo;
    }

    public void setNewInfo(List<Map> newInfo) {
        this.newInfo = newInfo;
    }
}
