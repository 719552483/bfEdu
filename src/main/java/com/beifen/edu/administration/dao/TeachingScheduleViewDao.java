package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.SchoolTimetablePO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TeachingScheduleViewDao extends JpaRepository<SchoolTimetablePO, Long>, JpaSpecificationExecutor<SchoolTimetablePO> {

    @Query(value = "select e.* from TEACHING_SCHEDULE_VIEW e where e.edu101_id = ?1 and e.week = ?2 and e.xnid = ?3",nativeQuery = true)
    List<SchoolTimetablePO> findAllByEdu101Id(String edu101id, String weekTime, String semester);
}

