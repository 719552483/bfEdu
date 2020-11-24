package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.CourseCheckOnPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CourseCheckOnDao extends JpaRepository<CourseCheckOnPO, String>, JpaSpecificationExecutor<CourseCheckOnPO> {

    //根据任务书查询考勤详情
    @Query(value = "select * from course_checkon_view t where t.EDU201_ID = ?1",nativeQuery = true)
    List<CourseCheckOnPO> findAllByEdu201(String taskId);
}
