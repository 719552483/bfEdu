package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.StudentSchoolTimetablePO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StudentScheduleViewDao extends JpaRepository<StudentSchoolTimetablePO, Long>, JpaSpecificationExecutor<StudentSchoolTimetablePO> {

    //学生查询周课表
    @Query(value = "select e.* from STUDENT_SCHEDULE_VIEW e where e.class_id in ?1 and e.week = ?2 and e.xnid = ?3 and e.teacher_type = '01'",nativeQuery = true)
    List<StudentSchoolTimetablePO> findAllByEdu301Ids(String[] classIds, String weekTime, String semester);

    //学生查询任务书id
    @Query(value = "select distinct  e.edu201_id from STUDENT_SCHEDULE_VIEW e where e.class_id in ?1 and e.xnid = ?2",nativeQuery = true)
    List<String> findEdu201IdsByEdu301Ids(String[] classIds, String semester);
}

