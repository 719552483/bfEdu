package com.beifen.edu.administration.PO;

import com.beifen.edu.administration.domian.Edu201;
import com.beifen.edu.administration.domian.Edu300;

import java.util.List;

//任务书新增PO类
public class TeachingTaskPO extends Edu201 {
    private List<TeacherPO> teacherList;
    private List<Edu300> classList;

    public List<TeacherPO> getTeacherList() {
        return teacherList;
    }

    public void setTeacherList(List<TeacherPO> teacherList) {
        this.teacherList = teacherList;
    }

    public List<Edu300> getClassList() {
        return classList;
    }

    public void setClassList(List<Edu300> classList) {
        this.classList = classList;
    }
}
