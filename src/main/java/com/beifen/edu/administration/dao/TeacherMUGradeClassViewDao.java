package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.TeacherMUGradeClassPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;


public interface TeacherMUGradeClassViewDao extends JpaRepository<TeacherMUGradeClassPO, Long>, JpaSpecificationExecutor<TeacherMUGradeClassPO> {

    @Query(value = "select * from TEACHER_MU_GRADE_CLASS e  where  e.id =?1", nativeQuery = true)
    TeacherMUGradeClassPO findbyid(String id);
}

