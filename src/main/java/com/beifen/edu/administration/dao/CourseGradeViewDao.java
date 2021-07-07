package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.CourseGradeViewPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface CourseGradeViewDao extends JpaRepository<CourseGradeViewPO, Long>, JpaSpecificationExecutor<CourseGradeViewPO> {


    @Query(value = "select * from COURSE_GRADE_VIEW where sfsqks = 'T' and IS_CONFIRM is null and ls like %?1%",nativeQuery = true)
    List<CourseGradeViewPO> searchCourseGetGradeByTeacher(String taskId);
}

