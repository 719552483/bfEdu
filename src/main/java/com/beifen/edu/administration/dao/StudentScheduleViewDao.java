package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.StudentSchoolTimetablePO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StudentScheduleViewDao extends JpaRepository<StudentSchoolTimetablePO, Long>, JpaSpecificationExecutor<StudentSchoolTimetablePO> {


    @Query(value = "select e.* from STUDENT_SCHEDULE_VIEW e where e.class_id in ?1 and e.week = ?2 and e.xnid = ?3",nativeQuery = true)
    List<StudentSchoolTimetablePO> findAllByEdu301Ids(List<Long> edu301IdList, String weekTime, String semester);
}

