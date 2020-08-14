package com.beifen.edu.administration.PO;

import com.beifen.edu.administration.domian.Edu101;
import com.beifen.edu.administration.domian.Edu201;
import com.beifen.edu.administration.domian.Edu300;
import com.beifen.edu.administration.domian.Edu301;

import java.util.List;

//任务书新增PO类
public class TeachingTaskPO extends Edu201 {
    private List<Edu101> teacherList;//老师集合
    private List<Edu101> baseTeacherList;//主要老师集合
    private List<Edu301> classList;//教学班集合

    public List<Edu101> getTeacherList() {
        return teacherList;
    }

    public void setTeacherList(List<Edu101> teacherList) {
        this.teacherList = teacherList;
    }

    public List<Edu101> getBaseTeacherList() {
        return baseTeacherList;
    }

    public void setBaseTeacherList(List<Edu101> baseTeacherList) {
        this.baseTeacherList = baseTeacherList;
    }

    public List<Edu301> getClassList() {
        return classList;
    }

    public void setClassList(List<Edu301> classList) {
        this.classList = classList;
    }
}
