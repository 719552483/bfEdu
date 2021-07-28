package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.TeacherGradeClassPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;



public interface TeacherGradeClassViewDao extends JpaRepository<TeacherGradeClassPO, Long>, JpaSpecificationExecutor<TeacherGradeClassPO> {

    @Query(value = "select * from TEACHER_GRADE_CLASS e  where  e.id =?1", nativeQuery = true)
    TeacherGradeClassPO findbyid(String id);
}

