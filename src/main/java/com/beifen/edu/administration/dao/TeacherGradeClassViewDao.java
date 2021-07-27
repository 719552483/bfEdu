package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.TeacherGradeClassPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


public interface TeacherGradeClassViewDao extends JpaRepository<TeacherGradeClassPO, Long>, JpaSpecificationExecutor<TeacherGradeClassPO> {

}

