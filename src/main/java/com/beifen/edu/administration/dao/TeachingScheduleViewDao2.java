package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.SchoolTimetablePO2;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface TeachingScheduleViewDao2 extends JpaRepository<SchoolTimetablePO2, Long>, JpaSpecificationExecutor<SchoolTimetablePO2> {

    //教师查询周课表
    @Query(value = "select * from TEACHING_SCATTERED_VIEW e where e.xnid = ?1",nativeQuery = true)
    List<SchoolTimetablePO2> findAllByXnAndEdu104Id(String xnid);
}

