package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.ClassStudentViewPO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


public interface ClassStudentViewDao extends JpaRepository<ClassStudentViewPO, Long>, JpaSpecificationExecutor<ClassStudentViewPO> {

}

