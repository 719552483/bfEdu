package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.CourseGradeViewPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


public interface CourseGradeViewDao extends JpaRepository<CourseGradeViewPO, Long>, JpaSpecificationExecutor<CourseGradeViewPO> {

}
