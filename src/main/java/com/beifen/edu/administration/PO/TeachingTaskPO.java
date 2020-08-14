package com.beifen.edu.administration.PO;

import com.beifen.edu.administration.domian.Edu201;
import com.beifen.edu.administration.domian.Edu301;

import java.util.List;

//任务书新增PO类
public class TeachingTaskPO extends Edu201 {
    private List<TeacherPO> teacherList;//老师集合
    private List<TeacherPO> baseTeacherList;//主要老师集合
    private List<Edu301> classList;//教学班集合

    public List<TeacherPO> getTeacherList() {
        return teacherList;
    }

    public void setTeacherList(List<TeacherPO> teacherList) {
        this.teacherList = teacherList;
    }

    public List<TeacherPO> getBaseTeacherList() {
        return baseTeacherList;
    }

    public void setBaseTeacherList(List<TeacherPO> baseTeacherList) {
        this.baseTeacherList = baseTeacherList;
    }

    public List<Edu301> getClassList() {
        return classList;
    }

    public void setClassList(List<Edu301> classList) {
        this.classList = classList;
    }
}
